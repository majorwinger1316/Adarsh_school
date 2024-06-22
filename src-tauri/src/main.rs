use tauri::command;
use serde::{Deserialize, Serialize};
use sqlx::mysql::MySqlPool;
use sqlx::FromRow;
use sqlx::Row;
use dotenv::dotenv;
use std::env;
use sqlx::mysql::MySql;

#[derive(Serialize)]
struct Class {
    s_no: i32,
    class_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SearchCriteria {
    name: Option<String>,
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

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Student {
    name: String,
    dob: String, // Assuming dob is stored as a string in "YYYY-MM-DD" format
    scholar_number: i32,
    ClassName: String,
    father_name: String,
    mother_name: String,
    address: String,
    mobile_num: String,
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
    date: String
}

#[command]
async fn add_fee(fee_details: FeeDetails) -> Result<(), String> {
    let pool = MySqlPool::connect(&env::var("DATABASE_URL").unwrap())
        .await
        .map_err(|e| e.to_string())?;
    
    sqlx::query("INSERT INTO Fees (scholar_number, Admission_fee, Tution_fee, Exam_fee, Annual_charges, Total_fee, date) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(fee_details.scholar_number)
        .bind(fee_details.admission_fee)
        .bind(fee_details.tution_fee)
        .bind(fee_details.exam_fee)
        .bind(fee_details.annual_charges)
        .bind(fee_details.total_fee)
        .bind(fee_details.date)
        .execute(&pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
async fn update_student(updated_student: Student) -> Result<(), String> {
    let pool = MySqlPool::connect(&env::var("DATABASE_URL").unwrap())
        .await
        .map_err(|e| e.to_string())?;

    sqlx::query("UPDATE Students SET name = ?, dob = ?, ClassName = ?, father_name = ?, mother_name = ?, address = ?, mobile_num = ? WHERE scholar_number = ?")
        .bind(&updated_student.name)
        .bind(&updated_student.dob)
        .bind(&updated_student.ClassName)
        .bind(&updated_student.father_name)
        .bind(&updated_student.mother_name)
        .bind(&updated_student.address)
        .bind(&updated_student.mobile_num)
        .bind(&updated_student.scholar_number)  // Use scholar_number as unique identifier
        .execute(&pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
async fn search_students(criteria: SearchCriteria) -> Result<Vec<Student>, String> {
    let pool = MySqlPool::connect(&env::var("DATABASE_URL").unwrap())
        .await
        .map_err(|e| e.to_string())?;

    let query = "SELECT name, dob, scholar_number, ClassName, father_name, mother_name, address, mobile_num
                 FROM Students
                 WHERE name LIKE ?";

    let search_param = format!("%{}%", criteria.name.unwrap_or_default());

    let query_result = sqlx::query_as::<MySql, Student>(query)
        .bind(search_param)
        .fetch_all(&pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(query_result)
}

#[command]
async fn fetch_classes() -> Result<Vec<Class>, String> {
    let pool = MySqlPool::connect(&env::var("DATABASE_URL").unwrap()).await.map_err(|e| e.to_string())?;
    let rows = sqlx::query("SELECT S_no, ClassName FROM Classes")
        .fetch_all(&pool).await.map_err(|e| e.to_string())?;

    let classes: Vec<Class> = rows.iter().map(|row| {
        Class {
            s_no: row.get("S_no"),
            class_name: row.get("ClassName"),
        }
    }).collect();

    Ok(classes)
}

#[command]
async fn add_class(class_name: String) -> Result<(), String> {
    let pool = MySqlPool::connect(&env::var("DATABASE_URL").unwrap()).await.map_err(|e| e.to_string())?;
    sqlx::query("INSERT INTO Classes (ClassName) VALUES (?)")
        .bind(class_name)
        .execute(&pool)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
async fn add_student(student: Student) -> Result<(), String> {
    let pool = MySqlPool::connect(&env::var("DATABASE_URL").unwrap())
        .await
        .map_err(|e| e.to_string())?;

    sqlx::query("INSERT INTO Students (name, dob, scholar_number, ClassName, father_name, mother_name, address, mobile_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(&student.name)
        .bind(&student.dob)
        .bind(&student.scholar_number)
        .bind(&student.ClassName)
        .bind(&student.father_name)
        .bind(&student.mother_name)
        .bind(&student.address)
        .bind(&student.mobile_num)
        .execute(&pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
async fn fetch_fee_by_scholar_number(scholar_number: i32) -> Result<Vec<FeeRecord>, String> {
    let pool = MySqlPool::connect(&env::var("DATABASE_URL").unwrap()).await.map_err(|e| e.to_string())?;

    let fee_records = sqlx::query_as!(
        FeeRecord,
        "SELECT invoice_number, scholar_number, admission_fee, tution_fee, exam_fee, annual_charges, total_fee, date
         FROM Fees WHERE scholar_number = ?",
        scholar_number
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| e.to_string())?;

    Ok(fee_records)
}

#[command]
async fn update_fee(updated_fee: FeeDetails) -> Result<(), String> {
    let pool = MySqlPool::connect(&env::var("DATABASE_URL").unwrap())
        .await
        .map_err(|e| e.to_string())?;

    sqlx::query("UPDATE Fees SET Admission_fee = ?, Tution_fee = ?, Exam_fee = ?, Annual_charges = ?, Total_fee = ? WHERE scholar_number = ? AND date = ?")
        .bind(updated_fee.admission_fee)
        .bind(updated_fee.tution_fee)
        .bind(updated_fee.exam_fee)
        .bind(updated_fee.annual_charges)
        .bind(updated_fee.total_fee)
        .bind(updated_fee.scholar_number)
        .bind(updated_fee.date)
        .execute(&pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn fetch_students_by_class(criteria: SearchCriteria) -> Result<Vec<Student>, String> {
    let pool = MySqlPool::connect(&env::var("DATABASE_URL").unwrap())
        .await
        .map_err(|e| e.to_string())?;

    let query = "SELECT name, dob, scholar_number, ClassName, father_name, mother_name, address, mobile_num
                 FROM Students
                 WHERE ClassName LIKE ?";

    let search_param = format!("%{}%", criteria.name.unwrap_or_default());

    let query_result = sqlx::query_as::<MySql, Student>(query)
        .bind(search_param)
        .fetch_all(&pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(query_result)
}

fn main() {
    dotenv().ok(); // Load environment variables from .env file
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            fetch_classes, 
            add_class, 
            add_student, 
            search_students, 
            update_student, 
            add_fee,
            fetch_fee_by_scholar_number,
            update_fee,
            fetch_students_by_class
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
