import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DatabaseService, Prod } from './../services/database.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page{
  barnum: string;
  product: Prod = null;
  ingredients = '';

  // DI barcodeScanner
  constructor(private barcodeScanner: BarcodeScanner, private db: DatabaseService){ }

  
  
  

  scan() {
    this.barcodeScanner.scan().then(data => {
        // this is called when a barcode is found
        this.barnum = data.text
      }).catch(err => {
        console.log('Error', err);
    });  
  }
  showProduct(){
    this.db.getProduct(this.barnum).then(data => {
      this.product = data;
      this.ingredients = this.product.ingredients.join(',');
    }).catch(err => {
      console.log('Error', err);
  });    
  }
ionViewDidEnter() {
  this.scan();
}
  

}
