import { createContext, ReactNode, useRef } from "react";
import data from "../db/db";
import System from "../models/system";
import Category from "../models/category";

interface ParametrizedData {
  dataCategories: { [key: string]: Category };
  dataUse: { [key: string]: string };
  dependencies: { [key: string]: string };
}

interface SystemContextType {
  systems: System[];
  parametrizedData: ParametrizedData;
}

const SystemContext = createContext<SystemContextType>({
  systems: [],
  parametrizedData: { dataCategories: {}, dataUse: {}, dependencies: {} },
});

interface SystemProviderParams {
  children: ReactNode;
}

/**
 * Function to get the system's data categories from privacy declarations
 */
const getSystemCategories = (systemDataItem: {
  privacy_declarations: { data_categories: string[] }[];
}): string[] => {
  // Flattening the 'data_categories' from all privacy declarations into a single array of categories
  return systemDataItem.privacy_declarations
    .map((declaration) => {
      // Extracting 'data_categories' for each declaration
      return declaration.data_categories;
    })
    .flat();
};

// Function to get the system's data use types from privacy declarations
const getDataUse = (systemDataItem: {
  privacy_declarations: { data_use: string }[];
}): string[] => {
  // Mapping over 'data_use' from each privacy declaration and returning it as an array
  return systemDataItem.privacy_declarations.map((declaration) => {
    return declaration.data_use;
  });
};

// Function to build parametrized data, which is a mapping of data categories and data use
const buildParametrizedData = (): ParametrizedData => {
  const parametrizedData: ParametrizedData = {
    dataCategories: {},
    dataUse: {},
    dependencies: {},
  };

  // Getting a flattened array of all categories from the data items
  const categories: string[] = data
    .map((dataItem) => {
      return getSystemCategories(dataItem);
    })
    // Flattening the array of categories
    .flat();

  // Mapping categories to create a mapping of category names in the parametrized data
  categories.forEach((category) => {
    if (!parametrizedData.dataCategories[category]) {
      const splittedCategory = category.split(".");
      // Get the last part as display name
      const displayName: string = splittedCategory[splittedCategory.length - 1];
      parametrizedData.dataCategories[category] = new Category({
        id: category,
        name: displayName,
      });
    }
  });

  // Getting a flattened array of all data use types from the data items
  const dataUse: string[] = data
    .map((dataItem) => {
      return getDataUse(dataItem);
    })
    .flat();

  // Adding each unique data use type to the parametrized data
  dataUse.forEach((dataUse) => {
    if (!parametrizedData.dataUse[dataUse]) {
      parametrizedData.dataUse[dataUse] = dataUse;
    }
  });

  data.forEach((dataItem) => {
    parametrizedData.dependencies[dataItem.fides_key] = dataItem.name;
  });

  return parametrizedData;
};

const buildSystems = (parametrizedData: ParametrizedData): System[] => {
  // Mapping each data item to create a new System instance
  return data.map((dataItem) => {
    // Creating an empty map for the data categories of the system
    // We can quickly look for a category when we are on the system.
    const dataCategoriesMap: { [key: string]: string } = {};
    // Get the categories for the system
    const categories = getSystemCategories(dataItem);
    categories.forEach((category) => {
      // Mapping each category to the parametrized category name
      dataCategoriesMap[category] =
        parametrizedData.dataCategories[category].name;
    });

    // Creating an empty map for the data use of the system
    // We can quickly look for a data use when we are on the system.
    const dataUseMap: { [key: string]: string } = {};
    const dataUse = getDataUse(dataItem);
    dataUse.forEach((dataUseItem) => {
      // Mapping each data use to its value in the parametrized data
      dataUseMap[dataUseItem] = parametrizedData.dataUse[dataUseItem];
    });

    return new System({
      name: dataItem.name,
      type: dataItem.system_type,
      dataCategoriesMap,
      dataUseMap,
      description: dataItem.description,
      privacyDeclarations: dataItem.privacy_declarations.map(
        (declaration) => declaration.name
      ),
      // We build system dependencies in a way that we are showing the system name and not just the key
      systemDependencies: dataItem.system_dependencies.map(
        (dependency) => parametrizedData.dependencies[dependency]
      ),
      fidesKey: dataItem.fides_key,
    });
  });
};

const SystemProvider = ({ children }: SystemProviderParams) => {
  // We get the parametrized data to load the static filters.
  const parametrizedDataRef = useRef<ParametrizedData>(buildParametrizedData());
  // We build the systems form the static data. The idea is that each component can group or use this data as it wants.
  const systemsRef = useRef<System[]>(
    buildSystems(parametrizedDataRef.current)
  );

  return (
    <SystemContext.Provider
      value={{
        systems: systemsRef.current,
        parametrizedData: parametrizedDataRef.current,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export { SystemContext, SystemProvider };
