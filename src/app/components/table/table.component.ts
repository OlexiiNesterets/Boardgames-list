import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { gamesList } from '../../games-list';
import { Boardgame } from '../../models/boardgame';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as sample from 'lodash.sample';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit, AfterContentInit {

  @ViewChild('playersInput') playersInput: NgModel;
  @ViewChild('name') nameInput: ElementRef;
  @ViewChild('chooseGamesForRandom') checkboxRandom: NgModel;

  gamesList = gamesList;
  gamesToShow;
  recommendedGame: Boardgame;
  showModal: boolean;
  showChoosenList: boolean;
  chooseForRandom: boolean;
  choosenGames = [];

  amount: number;

  isAscending = {
    name: false,
    min: true,
    max: true
  };

  namePreviousState: boolean;

  selectedHeading;
  selectedGame: Boardgame;

  checkboxSelections: any = {};

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'arrow',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/down-arrow.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'menu',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/menu.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'remove',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/remove.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'close',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/close.svg')
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
    this.playersInput.valueChanges.subscribe(() => {
      setTimeout(() => {
        this.onSubmit();
      }, 0);
    });

    this.checkboxRandom.valueChanges.subscribe(result => {
      setTimeout(() => {
        this.selectedGame = null
        this.choosenGames = result ? this.choosenGames : [];
        this.checkboxSelections = {};
      }, 0);
    });
  }

  onSubmit() {
    const amount = +this.amount;
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

      if (this.choosenGames.length) {
        this.choosenGames = this.choosenGames.filter(game => {
          const maxLimitOk = !game.players.max || game.players.max >= amount;
          const minLimitOk = game.players.min <= amount;
          if (!(minLimitOk && maxLimitOk)) {
            this.checkboxSelections[game.name] = false;
          }
          return minLimitOk && maxLimitOk;
        });
      }
    } else {
      this.gamesToShow = gamesList;
    }
    console.log('after filtering');
  }

  toSortName(elem?) {

    if (!this.checkForSelected(elem)) {
      this.gamesToShow.sort((gameFirst, gameSecond) => {
        if (!this.isAscending.name) {
          return gameFirst.name < gameSecond.name ? 1 : -1;
        }
        return gameFirst.name > gameSecond.name ? 1 : -1;
      });
      this.toSelect(elem);
      return;
    }

    this.sortNameHelper(elem);
  }

  private sortNameHelper(elem?) {
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

    this.namePreviousState = this.isAscending.name;

    if (!this.checkForSelected(elem)) {
      this.toSelect(elem);
      this.isAscending.name = true;
      this.sortNameHelper(elem);
      this.gamesToShow.sort((gameFirst, gameSecond) => {
        if (!this.isAscending.min) {
          return gameFirst.players.min < gameSecond.players.min ? 1 : -1;
        }
        return gameFirst.players.min > gameSecond.players.min ? 1 : -1;
      });
      this.isAscending.name = this.namePreviousState;
      return;
    }

    this.isAscending.name = true;
    this.sortNameHelper(elem);

    this.gamesToShow.sort((gameFirst, gameSecond) => {
      if (this.isAscending.min) {
        return gameFirst.players.min < gameSecond.players.min ? 1 : -1;
      }
      return gameFirst.players.min > gameSecond.players.min ? 1 : -1;
    });
    this.isAscending.min = !this.isAscending.min;
    this.toSelect(elem);
    this.isAscending.name = this.namePreviousState;
  }

  toSortPlayersMax(elem) {

    this.namePreviousState = this.isAscending.name;

    if (!this.checkForSelected(elem)) {
      this.toSelect(elem);
      this.isAscending.name = true;
      this.sortNameHelper(elem);
      this.gamesToShow.sort((gameFirst, gameSecond) => {
        const first = gameFirst.players.max ? gameFirst.players.max : 999;
        const second = gameSecond.players.max ? gameSecond.players.max : 999;
        if (!this.isAscending.max) {
          return first < second ? 1 : -1;
        }
        return first > second ? 1 : -1;
      });
      this.isAscending.name = this.namePreviousState;
      return;
    }

    this.isAscending.name = true;
    this.sortNameHelper(elem);

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
    this.isAscending.name = this.namePreviousState;
  }

  toSelect(elem: ElementRef) {
    this.selectedHeading = elem;
  }

  checkForSelected(elem) {
    return elem === this.selectedHeading;
  }

  onCLick(game: Boardgame) {
    console.log('click');
    if (!this.chooseForRandom) {
      this.selectedGame = game;
    }
  }

  onDoubleClick(game: Boardgame) {
    console.log('dbclick');
    if (!this.chooseForRandom) {
      this.googleGameSearch(game);
    }
  }

  onCheck(game: Boardgame) {
      if (!this.choosenGames.some(choosenGame => game.name === choosenGame.name)) {
      this.choosenGames.push(game);
      console.log({choosenGames: this.choosenGames});
    } else {
      this.choosenGames = this.choosenGames.filter(choosenGame => {
        return choosenGame.name !== game.name;
      });
      console.log({choosenGames: this.choosenGames});
    }
  }

  choosenContains(game: Boardgame) {
    return this.choosenGames.some(choosenGame => choosenGame.name === game.name);
  }

  googleGameSearch(game: Boardgame) {
    const searchName = game.searchName.toLowerCase().replace(' ', '+');
    open(`https://www.google.com.ua/search?&q=${searchName}+настольная+игра`, `_blank`);
  }

  getRandom(arr?: any) {
    if (arr && arr.length) {
      this.recommendedGame = sample(arr.map(game => game.name));
    } else {
      this.recommendedGame = sample(this.gamesToShow.map(game => game.name));      
    }
    this.showModal = true;
  }

  removeGame(game: Boardgame) {
    this.choosenGames = this.choosenGames.filter(currGame => {
      return currGame.name !== game.name});
    if (!this.choosenGames.length) {
      this.showChoosenList = false;
    }
    this.checkboxSelections[game.name] = false;
  }

}
