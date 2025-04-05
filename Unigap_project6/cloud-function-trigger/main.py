from google.cloud import bigquery
import os

# Define schema for staging_table_2
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

def trigger_bigquery_load(event, context):
    file_name = event['name']
    bucket_name = event['bucket']
    
    if not file_name.endswith(".csv.gz"):
        print(f"⛔ Skipping unsupported file: {file_name}")
        return

    gcs_uri = f"gs://{bucket_name}/{file_name}"
    print(f"🔄 Starting to load file: {gcs_uri} into BigQuery...")

    client = bigquery.Client()
    dataset_id = "raw_layer_dataset"
    table_id = "test_table"
    table_ref = client.dataset(dataset_id).table(table_id)

    job_config = bigquery.LoadJobConfig(
        schema=STAGING_SCHEMA,
        source_format=bigquery.SourceFormat.CSV,
        skip_leading_rows=1,
        field_delimiter=",",
        write_disposition=bigquery.WriteDisposition.WRITE_APPEND,
        allow_quoted_newlines=True,
        ignore_unknown_values=True
    )

    load_job = client.load_table_from_uri(gcs_uri, table_ref, job_config=job_config)
    load_job.result()

    print(f"✅ Successfully loaded {load_job.output_rows} rows from '{file_name}' into BigQuery table '{dataset_id}.{table_id}'.")

