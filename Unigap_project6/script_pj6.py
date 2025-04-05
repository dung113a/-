import os
import io
import gzip
import logging
from pymongo import MongoClient
import pandas as pd
from google.cloud import storage
from concurrent.futures import ThreadPoolExecutor, as_completed

# Đường dẫn credentials:
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/home/dungluu/MyProject/test/all_test/Unigap_project6/project5-unigap-413d542c164a.json"

# Cấu hình logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

CHECKPOINT_FILE = "checkpoint.txt"

# Danh sách cột cố định đúng schema BigQuery
COLUMNS = [
    "_id", "time_stamp", "ip", "user_agent", "resolution", "user_id_db", "device_id",
    "api_version", "store_id", "local_time", "show_recommendation", "current_url",
    "referrer_url", "email_address", "recommendation", "utm_source", "utm_medium",
    "collection", "product_id", "option_id", "option_name", "option_value",
    "order_id", "cart_products", "cat_id", "collect_id", "viewing_product_id",
    "recommendation_product_id", "recommendation_clicked_position", "price",
    "currency", "is_paypal", "key_search"
]

def read_checkpoint():
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r") as f:
            val = f.read().strip()
            if val.isdigit():
                return int(val)
    return -1

def write_checkpoint(batch_index):
    with open(CHECKPOINT_FILE, "w") as f:
        f.write(str(batch_index))

def connect_to_mongodb(uri, db_name, collection_name):
    try:
        client = MongoClient(uri)
        db = client[db_name]
        collection = db[collection_name]
        logging.info("Kết nối thành công đến MongoDB!")
        return collection
    except Exception as e:
        logging.error(f"Lỗi khi kết nối MongoDB: {e}")
        raise

def extract_data(collection, batch_size=10000, start_batch=0):
    try:
        cursor = collection.find()
        data_batch = []
        current_batch_index = 0

        for doc in cursor:
            doc['_id'] = str(doc.get('_id', ''))
            if 'option' in doc and isinstance(doc['option'], dict):
                doc['option_id'] = doc['option'].get('option_id', None)
                doc['option_name'] = doc['option'].get('option_name', None)
                doc['option_value'] = doc['option'].get('option_value', None)
            doc.pop('option', None)

            complete_doc = {col: doc.get(col, None) for col in COLUMNS}
            data_batch.append(complete_doc)

            if len(data_batch) >= batch_size:
                if current_batch_index >= start_batch:
                    df = pd.DataFrame(data_batch, columns=COLUMNS)
                    yield (current_batch_index, df)
                current_batch_index += 1
                data_batch = []

        if data_batch:
            if current_batch_index >= start_batch:
                yield (current_batch_index, pd.DataFrame(data_batch, columns=COLUMNS))

    except Exception as e:
        logging.error(f"Lỗi khi trích xuất dữ liệu: {e}")
        raise

def upload_gz_bytes_to_gcs(bucket_name, blob_name, gz_bytes):
    try:
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.upload_from_string(gz_bytes)
        logging.info(f"Đã upload {blob_name} lên GCS.")
    except Exception as e:
        logging.error(f"Lỗi khi upload lên GCS: {e}")
        raise

def process_one_batch(batch_index, df, bucket_name):
    if df.empty:
        logging.info(f"Batch {batch_index} rỗng. Bỏ qua.")
        return

    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False, quoting=1)

    csv_bytes = csv_buffer.getvalue().encode("utf-8")
    gz_buffer = io.BytesIO()
    with gzip.GzipFile(mode='wb', fileobj=gz_buffer) as gz_file:
        gz_file.write(csv_bytes)

    compressed_data = gz_buffer.getvalue()
    blob_name = f"data/batch_{batch_index}.csv.gz"
    upload_gz_bytes_to_gcs(bucket_name, blob_name, compressed_data)

    logging.info(f"Batch {batch_index} đã xử lý xong.")

def main():
    last_completed_batch = read_checkpoint()
    logging.info(f"Checkpoint hiện tại = {last_completed_batch}.")

    uri = "mongodb://admin:cado@34.58.109.119:27017/countly?authSource=admin"
    collection = connect_to_mongodb(uri, "countly", "summary")

    bucket_name = "project5-unigap"
    futures_map = {}

    max_workers = 4
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for (batch_idx, df) in extract_data(collection, 10000, start_batch=last_completed_batch+1):
            future = executor.submit(process_one_batch, batch_idx, df, bucket_name)
            futures_map[future] = batch_idx

        for future in as_completed(futures_map):
            b_idx = futures_map[future]
            try:
                future.result()
                current_checkpoint = max(read_checkpoint(), b_idx)
                write_checkpoint(current_checkpoint)
                logging.info(f"Checkpoint cập nhật = {current_checkpoint}")
            except Exception as e:
                logging.error(f"Batch {b_idx} lỗi: {e}")

    logging.info("Hoàn tất xử lý.")

if __name__ == "__main__":
    main()

