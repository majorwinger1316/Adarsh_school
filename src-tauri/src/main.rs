use tauri::command;
use serde::{Deserialize, Serialize};
use sqlx::mysql::MySqlPool;
use sqlx::FromRow;
use sqlx::Row;
use sqlx::mysql::MySql;
use tokio;

#[derive(Serialize)]
struct Class {
    s_no: i32,
    class_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SearchCriteria {
    name: Option<String>,
}

#[derive(Serialize)]
struct Fee {
    invoice_number: i32,
    scholar_number: i32,
    admission_fee: i32,
    tution_fee: i32,
    exam_fee: i32,
    annual_charges: i32,
    total_fee: i32,
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

#[command]
async fn update_student(updated_student: Student) -> Result<(), String> {
    let pool = MySqlPool::connect("mysql://root:Football@1316@localhost:3306/2024")
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
    // Connect to the database
    let pool = MySqlPool::connect("mysql://root:Football@1316@localhost:3306/2024")
        .await
        .map_err(|e| e.to_string())?;

    // Prepare the SQL query
    let query = "SELECT name, dob, scholar_number, ClassName, father_name, mother_name, address, mobile_num
                 FROM Students
                 WHERE name LIKE ?";

    // Prepare the search parameter
    let search_param = format!("%{}%", criteria.name.unwrap_or_default());

    // Execute the query and fetch results
    let query_result = sqlx::query_as::<MySql, Student>(query)
        .bind(search_param)
        .fetch_all(&pool)
        .await
        .map_err(|e| e.to_string())?;

    Ok(query_result)
}

#[command]
async fn fetch_classes() -> Result<Vec<Class>, String> {
    let pool = MySqlPool::connect("mysql://root:Football@1316@localhost:3306/2024").await.map_err(|e| e.to_string())?;
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
    let pool = MySqlPool::connect("mysql://root:Football@1316@localhost:3306/2024").await.map_err(|e| e.to_string())?;
    sqlx::query("INSERT INTO Classes (ClassName) VALUES (?)")
        .bind(class_name)
        .execute(&pool)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
async fn fetch_fees() -> Result<Vec<Fee>, String> {
    let pool = MySqlPool::connect("mysql://root:Football@1316@localhost:3306/2024").await.map_err(|e| e.to_string())?;
    let rows = sqlx::query("SELECT invoice_number, scholar_number, Admission_fee, Tution_fee, Exam_fee, Annual_charges, Total_fee FROM Fees")
        .fetch_all(&pool).await.map_err(|e| e.to_string())?;

    let fees: Vec<Fee> = rows.iter().map(|row| {
        Fee {
            invoice_number: row.get("invoice_number"),
            scholar_number: row.get("scholar_number"),
            admission_fee: row.get("Admission_fee"),
            tution_fee: row.get("Tution_fee"),
            exam_fee: row.get("Exam_fee"),
            annual_charges: row.get("Annual_charges"),
            total_fee: row.get("Total_fee"),
        }
    }).collect();

    Ok(fees)
}

#[command]
async fn add_student(student: Student) -> Result<(), String> {
    // Connect to the database
    let pool = MySqlPool::connect("mysql://root:Football@1316@localhost:3306/2024")
        .await
        .map_err(|e| e.to_string())?;

    // Perform insertion query
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



fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_classes, fetch_fees, add_class, add_student, search_students, update_student])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
