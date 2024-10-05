use serde::{Deserialize, Serialize};
use sqlx::mysql::MySqlPoolOptions;
use sqlx::{FromRow, Row};
use dotenv::dotenv;
use std::env;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Schema {
    Database: String,  // Ensure this matches the column name returned by SHOW DATABASES
}

struct AppState {
    db_pool: sqlx::MySqlPool,
}

impl AppState {
    async fn new() -> Result<Self, sqlx::Error> {
        dotenv().ok();

        let database_url = env::var("DATABASE_URL_SESSION")
            .expect("DATABASE_URL_SESSION not set in .env file");

        let db_pool = MySqlPoolOptions::new()
            .max_connections(5)
            .connect(&database_url)
            .await?;

        Ok(Self { db_pool })
    }
}

#[tauri::command]
async fn fetch_schemas(state: tauri::State<'_, AppState>) -> Result<Vec<Schema>, String> {
    let pool = &state.db_pool;

    let query = r#"SHOW DATABASES"#;

    let schemas: Vec<Schema> = sqlx::query_as(query)
        .fetch_all(pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(schemas)
}

#[tauri::command]
async fn set_selected_schema(schema: String) -> Result<(), String> {
    std::env::set_var("SELECTED_SCHEMA", &schema);
    Ok(())
}

#[tauri::command]
async fn fetch_selected_schema() -> Result<String, String> {
    Ok(env::var("SELECTED_SCHEMA").unwrap_or_else(|_| "default_schema".to_string()))
}

#[derive(Serialize)]
struct Class {
    class_name: String,
}

#[tauri::command(async)]
async fn fetch_classes(state: tauri::State<'_, AppState>) -> Result<Vec<Class>, String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!("SELECT ClassName FROM `{}`.Classes", selected_schema);

    let rows = match sqlx::query(&query).fetch_all(pool).await {
        Ok(rows) => rows,
        Err(e) => {
            eprintln!("Failed to fetch classes: {}", e);
            return Err("Failed to fetch classes".to_string());
        }
    };

    let classes: Vec<Class> = rows.into_iter().map(|row| {
        Class {
            class_name: row.get("ClassName"), // Corrected struct field initialization
        }
    }).collect();

    Ok(classes)
}

#[tauri::command]
async fn add_class(class_name: String, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!("INSERT INTO `{}`.Classes (ClassName) VALUES (?)", selected_schema);

    sqlx::query(&query)
        .bind(class_name)
        .execute(pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Student {
    name: String,
    dob: String,
    scholar_number: i32,
    ClassName: String,
    father_name: String,
    mother_name: String,
    address: String,
    mobile_num: String,
}

#[tauri::command]
async fn add_student(student: Student, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!(
        "INSERT INTO `{}`.Students (name, dob, scholar_number, ClassName, father_name, mother_name, address, mobile_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        selected_schema
    );

    sqlx::query(&query)
        .bind(&student.name)
        .bind(&student.dob)
        .bind(&student.scholar_number)
        .bind(&student.ClassName)
        .bind(&student.father_name)
        .bind(&student.mother_name)
        .bind(&student.address)
        .bind(&student.mobile_num)
        .execute(pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
struct SearchCriteria {
    name: Option<String>,
}

#[tauri::command]
async fn search_students(criteria: SearchCriteria, state: tauri::State<'_, AppState>) -> Result<Vec<Student>, String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!(
        "SELECT name, dob, scholar_number, ClassName, father_name, mother_name, address, mobile_num
         FROM `{}`.Students
         WHERE name LIKE ?",
        selected_schema
    );

    let search_param = format!("%{}%", criteria.name.unwrap_or_default());

    let query_result = sqlx::query_as::<_, Student>(&query)
        .bind(search_param)
        .fetch_all(pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(query_result)
}


#[derive(serde::Serialize, sqlx::FromRow)]
struct StudentDetails {
    name: String,
    dob: String,
    scholar_number: i32,
    ClassName: String,
    father_name: String,
    mother_name: String,
    address: String,
    mobile_num: String,
}

#[tauri::command]
async fn fetch_student_by_scholar_number(scholar_number: i32, state: tauri::State<'_, AppState>) -> Result<StudentDetails, String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!(
        "SELECT name, dob, scholar_number, ClassName, father_name, mother_name, address, mobile_num
         FROM `{}`.Students
         WHERE scholar_number = ?",
        selected_schema
    );

    let query_result = sqlx::query_as::<_, StudentDetails>(&query)
        .bind(scholar_number)
        .fetch_one(pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(query_result)
}

#[tauri::command]
async fn update_student(updated_student: Student, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!(
        "UPDATE `{}`.Students SET name = ?, dob = ?, ClassName = ?, father_name = ?, mother_name = ?, address = ?, mobile_num = ? WHERE scholar_number = ?",
        selected_schema
    );

    sqlx::query(&query)
        .bind(&updated_student.name)
        .bind(&updated_student.dob)
        .bind(&updated_student.ClassName)
        .bind(&updated_student.father_name)
        .bind(&updated_student.mother_name)
        .bind(&updated_student.address)
        .bind(&updated_student.mobile_num)
        .bind(&updated_student.scholar_number)  // Use scholar_number as unique identifier
        .execute(pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn delete_student(state: tauri::State<'_, AppState>, scholar_number: i32) -> Result<(), String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool; // Get a reference to the pool

    let query = format!(
        "DELETE FROM `{}`.Students WHERE scholar_number =?",
        selected_schema
    );

    sqlx::query(&query)
      .bind(scholar_number)
      .execute(pool) // Pass a reference to pool
      .await
      .map_err(|e| e.to_string())?;

    Ok(())
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct FeeRecord {
    invoice_number: i32,
    scholar_number: i32,
    admission_fee: i32,
    tution_fee: i32,
    exam_fee: i32,
    annual_charges: i32,
    total_fee: i32,
    date: String,
}

#[derive(Deserialize)]
struct FeeDetails {
    scholar_number: i32,
    admission_fee: i32,
    tution_fee: i32,
    exam_fee: i32,
    annual_charges: i32,
    total_fee: i32,
    date: String,
}

#[tauri::command]
async fn add_fee(fee_details: FeeDetails, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!(
        "INSERT INTO `{}`.Fees (scholar_number, Admission_fee, Tution_fee, Exam_fee, Annual_charges, Total_fee, date) VALUES (?, ?, ?, ?, ?, ?, ?)",
        selected_schema
    );

    sqlx::query(&query)
        .bind(fee_details.scholar_number)
        .bind(fee_details.admission_fee)
        .bind(fee_details.tution_fee)
        .bind(fee_details.exam_fee)
        .bind(fee_details.annual_charges)
        .bind(fee_details.total_fee)
        .bind(fee_details.date)
        .execute(pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn fetch_fee_by_scholar_number(scholar_number: i32, state: tauri::State<'_, AppState>) -> Result<Vec<FeeRecord>, String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!(
        "SELECT invoice_number, scholar_number, admission_fee, tution_fee, exam_fee, annual_charges, total_fee, date
         FROM `{}`.Fees WHERE scholar_number =?",
        selected_schema
    );

    let fee_records = sqlx::query_as::<_, FeeRecord>(&query)
       .bind(scholar_number)
       .fetch_all(pool)
       .await
       .map_err(|e| e.to_string())?;

    Ok(fee_records)
}

#[tauri::command]
async fn update_fee(updated_fee: FeeDetails, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!(
        "UPDATE `{}`.Fees SET admission_fee =?, tution_fee =?, exam_fee =?, annual_charges =?, total_fee =? WHERE scholar_number =? AND date =?",
        selected_schema
    );

    sqlx::query(&query)
       .bind(updated_fee.admission_fee)
       .bind(updated_fee.tution_fee)
       .bind(updated_fee.exam_fee)
       .bind(updated_fee.annual_charges)
       .bind(updated_fee.total_fee)
       .bind(updated_fee.scholar_number)
       .bind(updated_fee.date)
       .execute(pool)
       .await
       .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn delete_fee(invoice_number: i32, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!(
        "DELETE FROM `{}`.Fees WHERE invoice_number = ?",
        selected_schema
    );

    sqlx::query(&query)
        .bind(invoice_number)
        .execute(pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}


#[tauri::command]
async fn fetch_students_by_class(class_name: String, state: tauri::State<'_, AppState>) -> Result<Vec<Student>, String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!(
        "SELECT name, dob, scholar_number, ClassName, father_name, mother_name, address, mobile_num FROM `{}`.Students WHERE ClassName =?",
        selected_schema
    );

    let students = sqlx::query_as::<_, Student>(&query)
       .bind(class_name)
       .fetch_all(pool)
       .await
       .map_err(|e| e.to_string())?;

    Ok(students)
}

#[derive(Deserialize)]
struct UpdateClassName {
    old_class_name: String,
    new_class_name: String,
}

#[tauri::command]
async fn update_class_name(update: UpdateClassName, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let selected_schema = match fetch_selected_schema().await {
        Ok(schema) => schema.replace("\"", ""), // Remove double quotes
        Err(err) => return Err(err.to_string()),
    };

    let pool = &state.db_pool;

    let query = format!(
        "UPDATE `{}`.Classes SET ClassName =? WHERE ClassName =?",
        selected_schema
    );

    sqlx::query(&query)
       .bind(&update.new_class_name)
       .bind(&update.old_class_name)
       .execute(pool)
       .await
       .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn fetch_fee_by_date_range(start_date: String, end_date: String, state: tauri::State<'_, AppState>) -> Result<Vec<FeeRecord>, String> {
    let selected_schema = fetch_selected_schema().await.unwrap_or_else(|_| "default_schema".to_string()).replace("\"", ""); // Remove double quotes
    let pool = &state.db_pool;
    
    let query = format!(
        "SELECT invoice_number, scholar_number, admission_fee, tution_fee, exam_fee, annual_charges, total_fee, date
         FROM `{}`.Fees
         WHERE date BETWEEN ? AND ?",
        selected_schema
    );
    
    let fee_records: Vec<FeeRecord> = sqlx::query_as(&query)
        .bind(start_date)
        .bind(end_date)
        .fetch_all(pool)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(fee_records)
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .manage(AppState::new().await.expect("Failed to create app state"))
        .invoke_handler(tauri::generate_handler![
            fetch_schemas,
            set_selected_schema,
            fetch_selected_schema,
            fetch_classes,
            add_class,
            add_student,
            add_fee,
            search_students,
            update_student,
            fetch_fee_by_scholar_number,
            update_fee,
            fetch_students_by_class,
            update_class_name,
            delete_student,
            delete_fee,
            fetch_student_by_scholar_number,
            fetch_fee_by_date_range
        ])
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            main_window.listen("login_successful", move |event| {
                if let Some(schema) = event.payload() {
                    std::env::set_var("SELECTED_SCHEMA", schema);
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
