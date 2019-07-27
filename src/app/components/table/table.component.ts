import { Component, OnInit, HostListener } from '@angular/core';
import { gamesList } from '../../games-list';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  gamesList = gamesList;

  gamesToShow = gamesList;

  form: { amount: number | null } = { amount: null };

  isAscending = {
    name: false,
    min: false,
    max: false
  };

  constructor() { }

  ngOnInit() {

  }

  onSubmit() {
    const amount = +this.form.amount;
    if (!Number.isInteger(amount)) {
      return;
    }
    this.gamesToShow = this.gamesList.filter(game => {
      const maxLimitOk = !game.players.max || game.players.max >= amount;
      const minLimitOk = game.players.min <= amount;
      return minLimitOk && maxLimitOk;
    })
  }

  toSortName() {
    this.gamesToShow.sort((gameFirst, gameSecond) => {
      if (this.isAscending.name) {
        return gameFirst.name < gameSecond.name ? 1 : -1;
      }
      return gameFirst.name > gameSecond.name ? 1 : -1;
    });
    this.isAscending.name = !this.isAscending.name;
  }

  toSortPlayersMin() {
    this.gamesToShow.sort((gameFirst, gameSecond) => {
      if (this.isAscending.min) {
        return gameFirst.players.min < gameSecond.players.min ? 1 : -1;
      }
      return gameFirst.players.min > gameSecond.players.min ? 1 : -1;
    });
    this.isAscending.min = !this.isAscending.min;
  }

  toSortPlayersMax() {
    this.gamesToShow.sort((gameFirst, gameSecond) => {
      const first = gameFirst.players.max ? gameFirst.players.max : 999;
      const second = gameSecond.players.max ? gameSecond.players.max : 999;
      if (this.isAscending.max) {
        return first < second ? 1 : -1;
      }
      return first > second ? 1 : -1;
    });
    this.isAscending.max = !this.isAscending.max;
  }

}
