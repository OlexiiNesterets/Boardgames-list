import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { gamesList } from '../../games-list';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit, AfterContentInit {

  @ViewChild('playersInput') playersInput: NgModel;
  @ViewChild('name') nameInput: ElementRef;

  gamesList = gamesList;
  gamesToShow;

  form: { amount: number | null } = { amount: null };

  isAscending = {
    name: false,
    min: false,
    max: false
  };

  selectedHeading;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'arrow',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/down-arrow.svg')
    );
  }

  ngOnInit() {
    this.gamesToShow = gamesList;
    this.toSortName();
    this.onSubmit();
  }

  ngAfterContentInit() {
    this.selectedHeading = this.nameInput.nativeElement;
  }

  ngAfterViewInit() {
    console.log(this.selectedHeading);
    this.playersInput.valueChanges.subscribe(val => {
      console.log(val);
      setTimeout(() => {
        this.onSubmit();
      }, 0);
    });
  }

  onSubmit() {
    const amount = +this.form.amount;
    if (!/\d/.test(amount.toString())) {
      console.log('returned');
      console.log(amount);
      return;
    }
    if (amount) {
      this.gamesToShow = this.gamesList.filter(game => {
        const maxLimitOk = !game.players.max || game.players.max >= amount;
        const minLimitOk = game.players.min <= amount;
        return minLimitOk && maxLimitOk;
      });
    } else {
      this.gamesToShow = gamesList;
    }
    console.log('after filtering');
  }

  toSortName(elem?) {
    this.gamesToShow.sort((gameFirst, gameSecond) => {
      if (this.isAscending.name) {
        return gameFirst.name < gameSecond.name ? 1 : -1;
      }
      return gameFirst.name > gameSecond.name ? 1 : -1;
    });
    this.isAscending.name = !this.isAscending.name;
    if (elem) {
      this.toSelect(elem);
    }
  }

  toSortPlayersMin(elem) {

    this.isAscending.name = true;
    this.toSortName();

    this.gamesToShow.sort((gameFirst, gameSecond) => {
      if (this.isAscending.min) {
        return gameFirst.players.min < gameSecond.players.min ? 1 : -1;
      }
      return gameFirst.players.min > gameSecond.players.min ? 1 : -1;
    });
    this.isAscending.min = !this.isAscending.min;
    this.toSelect(elem);
  }

  toSortPlayersMax(elem) {

    this.isAscending.name = true;
    this.toSortName();

    this.gamesToShow.sort((gameFirst, gameSecond) => {
      const first = gameFirst.players.max ? gameFirst.players.max : 999;
      const second = gameSecond.players.max ? gameSecond.players.max : 999;
      if (this.isAscending.max) {
        return first < second ? 1 : -1;
      }
      return first > second ? 1 : -1;
    });
    this.isAscending.max = !this.isAscending.max;
    this.toSelect(elem);
  }

  toSelect(elem: ElementRef) {
    this.selectedHeading = elem;
  }

}
