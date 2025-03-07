type BaseItem = {
  equipmentCosts: number;
  estimatedProfit: number;
  overheads: number;
  rowName: string;
  salary: number;
};

type BaseBackendItem = BaseItem & {
  machineOperatorSalary: number;
  mainCosts: number;
  materials: number;
  mimExploitation: number;
  supportCosts: number;
};

// FRONTEND
export type Item = BaseItem & {
  level?: number;
  parentId: number | null;
  id: number;
};

export type CreationItem = Omit<Item, 'id'>;

export type ItemNode = Item & {
  children: ItemNode[];
};

// BACKEND
// GET
export type BackendItemNode = BaseBackendItem & {
  child: BackendItemNode[];
  id: number;
  total: number;
};

// CREATE
export type CreationItemRequest = BaseBackendItem & {
  parentId: number | null;
};
export type ItemResponse = BaseBackendItem & {
  id: number;
  total: number;
};
export type CreationItemResponse = {
  changed: ItemResponse;
  current: ItemResponse;
};

// UPDATE
export type UpdateItemRequest = BaseBackendItem;
export type UpdateItemResponse = CreationItemResponse;

// DELETE
export type DeleteItemResponse = CreationItemResponse;
