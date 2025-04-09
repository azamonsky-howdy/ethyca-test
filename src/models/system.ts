interface ISystem {
  name: string;
  type: string;
  description: string;
  dataUseMap: { [key: string]: string };
  dataCategoriesMap: { [key: string]: string };
  privacyDeclarations: string[];
  systemDependencies: string[];
  fidesKey: string;
}

export default class System {
  constructor(data: ISystem) {
    this.name = data.name;
    this.type = data.type;
    this.dataUseMap = { ...data.dataUseMap };
    this.dataCategoriesMap = { ...data.dataCategoriesMap };
    this.description = data.description;
    this.privacyDeclarations = [...data.privacyDeclarations];
    this.systemDependencies = [...data.systemDependencies];
    this.fidesKey = data.fidesKey;
  }
  public name: string;
  public type: string;
  public description: string;
  // We build the dataUseMap as an Object Map to quick access at the moment of filtering.
  public dataUseMap: { [key: string]: string };
  public privacyDeclarations: string[];
  public systemDependencies: string[];
  public fidesKey: string;

  // We build the dataCategoriesMap as an Object Map to quick access at the moment of filtering.
  public dataCategoriesMap: {
    [key: string]: string;
  };
}
