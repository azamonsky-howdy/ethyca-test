interface ICategory {
  id: string;
  name: string;
}

export default class Category {
  constructor(data: ICategory) {
    this.id = data.id;
    this.name = data.name;
  }
  public name: string;
  public id: string;
}
