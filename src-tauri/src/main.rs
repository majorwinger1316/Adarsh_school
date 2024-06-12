use tauri::command;
use serde::Serialize;
use sqlx::mysql::MySqlPool;
use sqlx::Row;

#[derive(Serialize)]
struct Class {
    s_no: i32,
    class_name: String,
}

#[derive(Serialize)]
struct Student {
    s_no: i32,
    name: String,
    dob: String,
    scholar_number: i32,
    class_name: String,
    father_name: String,
    mother_name: String,
    address: String,
    mobile_num: String,
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

#[command] // Add this attribute
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
async fn fetch_students() -> Result<Vec<Student>, String> {
    let pool = MySqlPool::connect("mysql://root:Football@1316@localhost:3306/2024").await.map_err(|e| e.to_string())?;
    let rows = sqlx::query("SELECT S_no, name, dob, scholar_number, ClassName, father_name, mother_name, address, mobile_num FROM Students")
        .fetch_all(&pool).await.map_err(|e| e.to_string())?;

    let students: Vec<Student> = rows.iter().map(|row| {
        Student {
            s_no: row.get("S_no"),
            name: row.get("name"),
            dob: row.get("dob"),
            scholar_number: row.get("scholar_number"),
            class_name: row.get("ClassName"),
            father_name: row.get("father_name"),
            mother_name: row.get("mother_name"),
            address: row.get("address"),
            mobile_num: row.get("mobile_num"),
        }
    }).collect();

    Ok(students)
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_classes, fetch_students, fetch_fees, add_class])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
