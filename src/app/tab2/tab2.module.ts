import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { BrowserModule } from '@angular/platform-browser';

import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  entryComponents: [],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }
    ])
  ],
  providers: [
    SQLite,
    SQLitePorter
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
