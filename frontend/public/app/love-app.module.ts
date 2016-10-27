/**
 * Created by prayagupd on 10/26/16.
 */

import { NgModule }     from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import {ChatComponent} from "./Chat.component";

@NgModule({
    imports:    [ BrowserModule, FormsModule ],
    declarations:   [ ChatComponent ],
    bootstrap:      [ ChatComponent ]
})

export class LoveAppModule {}
