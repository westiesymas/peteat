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
  bcresult: string;
  constructor(private barcodeScanner: BarcodeScanner) { }
  scan() {
    this.barcodeScanner.scan().then(data => {
        // this is called when a barcode is found
        this.bcresult = data.text
      });      
  }
}
