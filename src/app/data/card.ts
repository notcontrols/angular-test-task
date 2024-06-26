
export interface CardDTO {
  country: string,
  username: string,
  birthday: string
}

export class Card {

  country!: string;
  username!: string;
  birthday!: string;

  constructor(data?: CardDTO) {

    this.reset();

    if (data) {
      this.country = data.country || '';
      this.username = data.username || '';
      this.birthday = data.birthday || '';
    }

  }

  reset() {
    this.country = '';
    this.username = '';
    this.birthday = '';
  }


  serialize(): CardDTO {
    return {
      country: this.country,
      username: this.username,
      birthday: this.birthday
    }
  }
}
