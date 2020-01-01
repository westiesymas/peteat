import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [Tab2Page]
})


export class Tab2PageModule {

  
  constructor(private barcodeScanner: BarcodeScanner) { }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      // success. barcodeData is the data returned by scanner
    }).catch(err => {
      // error
    });
  }
   
 }
