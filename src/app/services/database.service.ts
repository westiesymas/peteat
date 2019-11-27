import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

//DB
export interface Pro {
  id: number,
  brand: string,
  name: string,
  valuation: string,
  ingredients: string
}

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  products = new BehaviorSubject([]);


  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) { 
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'products.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }
    seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.loadProducts();
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }
 
  getDatabaseState() {
    return this.dbReady.asObservable();
  }
 

 
  loadProducts() {
    return this.database.executeSql('SELECT * FROM products', []).then(data => {
      let products: Pro[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
           products.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name, 
            brand: data.rows.item(i).brand, 
            valuation: data.rows.item(i).valuation,
            ingredients: data.rows.item(i).ingredients
           });
        }
      }
      this.products.next(products);
    });
  }
 
  addproduct(id, name, brand, valuation, ingredients) {
    let data = [id, name, brand, valuation, ingredients];
    return this.database.executeSql('INSERT INTO producs (id, brand, product, valuation, ingredientes) VALUES (?, ?, ?, ?, ?)', data).then(data => {
      this.loadProducts();
    });
  }
  getProducts(): Observable<any[]> {
    return this.products.asObservable();
  }
  getProduct(id): Promise<Pro> {
    return this.database.executeSql('SELECT * FROM products WHERE id = ?', [id]).then(data => {
      
 
      return {
        id: data.rows.item(0).id,
            name: data.rows.item(0).name, 
            brand: data.rows.item(0).brand, 
            valuation: data.rows.item(0).valuation,
            ingredients: data.rows.item(0).ingredients
      }
    });
  }
 
  deleteProduct(id) {
    return this.database.executeSql('DELETE FROM products WHERE id = ?', [id]).then(_ => {
      this.loadProducts();
    });
  }
 
  updateProduct(pro: Pro) {
    let data = [pro.id, pro.name, pro.brand, pro.valuation, pro.ingredients];
    return this.database.executeSql(`UPDATE products SET name = ?, brand = ?, valuation = ?, ingredientes = ? WHERE id = ${pro.id}`, data).then(data => {
      this.loadProducts();
    })
  }
  }
