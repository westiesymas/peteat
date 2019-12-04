// esto es del barcode
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DatabaseService, Pro } from './../services/database.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page implements OnInit {
  barnum: string;
  products: Pro[] = [];
 
  product = {};
 
 

  // DI barcodeScanner
  constructor(private barcodeScanner: BarcodeScanner, private db: DatabaseService){ }
  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getProducts().subscribe(prods => {
          this.products = prods;
        })
      }
    });
  }
 
  //addproduct() {
    //this.db.addproduct(this.product[this.barnum], this.product['name'], this.product['brand'],this.product['valuation'],this.product['ingredients'])
    //.then(_ => {
      //this.product = {};
    //});
  //}

  
 

  
    
  scan() {
    this.barcodeScanner.scan().then(data => {
        // this is called when a barcode is found
        this.barnum = data.text
      }).catch(err => {
        console.log('Error', err);
    });      
  }
  ionViewDidEnter() {
    this.scan();
    this.db.getProduct(this.barnum);
   
}
  

}
