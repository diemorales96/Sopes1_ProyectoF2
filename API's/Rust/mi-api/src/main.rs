use mongodb::{
    bson::doc,
    sync::Client, event::command::CommandEventHandler,
};

use serde::{Deserialize, Serialize};
use actix_cors::Cors;
use actix_web::{get, web, App, HttpServer, Responder, http};
use bson::{Bson};

#[derive(Debug, Serialize, Deserialize)]

struct Date{
    pub game_id: i32,
    pub players: i32,
    pub game_name: String,
    pub winner_number: i32,
    pub queue: String,
    pub request_number: i32
}

#[get("/hello/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[derive(Serialize)]
struct Country {
    country_code: String,
    country_name: String
}

async fn get_logs()  -> impl Responder {
    let mut vec:Vec<Date> = Vec::new();


    let client = Client::with_uri_str("mongodb://mongoadmin:hola123@34.136.79.58:27017/Fase2Sopes1?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false").unwrap();

    let db = client.database("Fase2Sopes1");
    let coll= db.collection::<Date>("log");
    println!("{:?}", coll);
    let cursor = coll.find(None, None).unwrap();

   

    for result in cursor{
        if let Ok(item) = result{
            vec.push(item);
        }
       
    }
 

    return web::Json(vec);
}

#[actix_web::main] 
async fn main() -> std::io::Result<()> {


    HttpServer::new(|| {

        let cors = Cors::default()
                .allowed_origin("https://frontf2-4fgwmqspza-uc.a.run.app")
                .allowed_methods(vec!["GET", "POST"])
                .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                .allowed_header(http::header::CONTENT_TYPE)
                .max_age(3600);

        App::new()
            .wrap(cors)
            .route("/get-all", web::get().to(get_logs))
            .service(greet)
    })
    .bind(("0.0.0.0", 5000))?
    .run()
    .await
}
