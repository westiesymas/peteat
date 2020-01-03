import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
 
export interface Prod {
  id: string,
  name: string,
  ingredients: any[],
  img: string
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
 
  getProds(): Observable<Prod[]> {
    return this.products.asObservable();
  }
 
  loadProducts() {
    return this.database.executeSql('SELECT * FROM product', []).then(data => {
      let products: Prod[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let ingredients = [];
          if (data.rows.item(i).ingredients != '') {
            ingredients = JSON.parse(data.rows.item(i).ingredients);
          }
 
          products.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name, 
            ingredients: ingredients, 
            img: data.rows.item(i).img
           });
        }
      }
      this.products.next(products);
    });
  }
  addProduct(name, ingredients, img) {
    let data = [name, JSON.stringify(ingredients), img];
    return this.database.executeSql('INSERT INTO product (name, ingredients, img) VALUES (?, ?, ?)', data).then(data => {
      this.loadProducts();
    });
  }
 
  getProduct(id): Promise<Prod> {
    return this.database.executeSql('SELECT * FROM product WHERE id = ?', [id]).then(data => {
      let ingredients = [];
      if (data.rows.item(0).ingredients != '') {
        ingredients = JSON.parse(data.rows.item(0).ingredients);
      }
 
      return {
        id: data.rows.item(0).id,
        name: data.rows.item(0).name, 
        ingredients: ingredients, 
        img: data.rows.item(0).img
      }
    });
  }
  deleteProduct(id) {
    return this.database.executeSql('DELETE FROM product WHERE id = ?', [id]).then(_ => {
      this.loadProducts();
    });
  }
 
  updateProduct(prod: Prod) {
    let data = [prod.name, JSON.stringify(prod.ingredients), prod.img];
    return this.database.executeSql(`UPDATE product SET name = ?, ingredients = ?, img = ? WHERE id = ${prod.id}`, data).then(data => {
      this.loadProducts();
    })
  }
}