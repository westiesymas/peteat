import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  barnum: string;

  // DI barcodeScanner
  constructor(private barcodeScanner: BarcodeScanner){ }
  
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
   
}
  

}
