from google.cloud import bigquery, storage
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/home/dungluu/MyProject/test/all_test/Unigap_project6/project5-unigap-413d542c164a.json"

# Schema staging (tất cả STRING)
STAGING_SCHEMA = [
    bigquery.SchemaField("_id", "STRING", mode="REQUIRED"),
    bigquery.SchemaField("time_stamp", "STRING"),
    bigquery.SchemaField("ip", "STRING"),
    bigquery.SchemaField("user_agent", "STRING"),
    bigquery.SchemaField("resolution", "STRING"),
    bigquery.SchemaField("user_id_db", "STRING"),
    bigquery.SchemaField("device_id", "STRING"),
    bigquery.SchemaField("api_version", "STRING"),
    bigquery.SchemaField("store_id", "STRING"),
    bigquery.SchemaField("local_time", "STRING"),
    bigquery.SchemaField("show_recommendation", "STRING"),
    bigquery.SchemaField("current_url", "STRING"),
    bigquery.SchemaField("referrer_url", "STRING"),
    bigquery.SchemaField("email_address", "STRING"),
    bigquery.SchemaField("recommendation", "STRING"),
    bigquery.SchemaField("utm_source", "STRING"),
    bigquery.SchemaField("utm_medium", "STRING"),
    bigquery.SchemaField("collection", "STRING"),
    bigquery.SchemaField("product_id", "STRING"),
    bigquery.SchemaField("option_id", "STRING"),
    bigquery.SchemaField("option_name", "STRING"),
    bigquery.SchemaField("option_value", "STRING"),
    bigquery.SchemaField("order_id", "STRING"),
    bigquery.SchemaField("cart_products", "STRING"),
    bigquery.SchemaField("cat_id", "STRING"),
    bigquery.SchemaField("collect_id", "STRING"),
    bigquery.SchemaField("viewing_product_id", "STRING"),
    bigquery.SchemaField("recommendation_product_id", "STRING"),
    bigquery.SchemaField("recommendation_clicked_position", "STRING"),
    bigquery.SchemaField("price", "STRING"),
    bigquery.SchemaField("currency", "STRING"),
    bigquery.SchemaField("is_paypal", "STRING"),
    bigquery.SchemaField("key_search", "STRING"),
]

# Hàm tải dữ liệu vào BigQuery
def load_csv_to_bigquery(client, dataset_id, table_id, schema, gcs_uri):
    table_ref = client.dataset(dataset_id).table(table_id)

    job_config = bigquery.LoadJobConfig(
        schema=schema,
        source_format=bigquery.SourceFormat.CSV,
        skip_leading_rows=1,
        field_delimiter=",",
        autodetect=False,
        write_disposition=bigquery.WriteDisposition.WRITE_APPEND,
        allow_quoted_newlines=True,
        ignore_unknown_values=True
 8   )

    load_job = client.load_table_from_uri(gcs_uri, table_ref, job_config=job_config)
    load_job.result()
    print(f"✅ Đã tải {gcs_uri} ({load_job.output_rows} dòng).")

# Hàm load toàn bộ file trong thư mục GCS
def load_all_files_from_gcs(bucket_name, prefix, dataset_id, table_id):
    storage_client = storage.Client()
    bigquery_client = bigquery.Client()

    bucket = storage_client.bucket(bucket_name)
    blobs = list(bucket.list_blobs(prefix=prefix))

    print(f"Tìm thấy {len(blobs)} file để tải lên BigQuery.")

    for blob in blobs:
        if blob.name.endswith(".csv.gz"):
            gcs_uri = f"gs://{bucket_name}/{blob.name}"
            print(f"🔄 Đang tải file: {gcs_uri}")
            load_csv_to_bigquery(bigquery_client, dataset_id, table_id, STAGING_SCHEMA, gcs_uri)

if __name__ == "__main__":
    BUCKET_NAME = "project5-trigger"
    PREFIX = ""
    DATASET_ID = "raw_layer_dataset"
    TABLE_ID = "staging_table_2"

    load_all_files_from_gcs(BUCKET_NAME, PREFIX, DATASET_ID, TABLE_ID)

