import { ItemNode, Item, BackendItemNode, ItemResponse } from "src/types/item";

export function treeToArray(nodes: ItemNode[]): {
  array: Item[];
  descendants: number;
  lastChildDescendants: number;
} {
  const array: Item[] = [];
  let descendants = nodes.length;
  let lastChildDescendants = 0;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const {
      array: nextArray,
      descendants: nextDescendants,
      lastChildDescendants: nextLastChildDescendants,
    } = treeToArray(node.children);
    const item = nodeToItem(node);
    item.descendantsTillLastChild = nextDescendants - nextLastChildDescendants;
    array.push(item);
    array.push(...nextArray);
    descendants += nextDescendants;

    if (i === nodes.length - 1) lastChildDescendants = nextDescendants;
  }

  return { array, descendants, lastChildDescendants };
}

export function nodeToItem(node: ItemNode): Item {
  return {
    equipmentCosts: node.equipmentCosts,
    estimatedProfit: node.estimatedProfit,
    id: node.id,
    overheads: node.overheads,
    parentId: node.parentId,
    rowName: node.rowName,
    salary: node.salary,
    isCreation: node.isCreation,
    level: node.level,
    hasChildren: !!node.children.length,
  };
}

export function createNewItemInstance(
  parentId: Item['parentId'],
  level: Item['level']
): ItemNode {
  return {
    id: -1,
    rowName: '',
    equipmentCosts: 0,
    estimatedProfit: 0,
    level,
    overheads: 0,
    salary: 0,
    parentId,
    children: [],
    isCreation: true,
  };
}

export function getBackendItemExtraProps() {
  return {
    machineOperatorSalary: 0,
    mainCosts: 0,
    materials: 0,
    mimExploitation: 0,
    supportCosts: 0,
  };
}

export function backendToFrontendItemTree(
  nodes: BackendItemNode[],
  parentId?: Item['parentId'],
  level: Item['level'] = 0
): ItemNode[] {
  return nodes.map((node) => ({
    ...extractFrontendItemProps(node),
    parentId: parentId || null,
    level,
    children: node.child
      ? backendToFrontendItemTree(node.child, node.id, level + 1)
      : [],
  }));
}

export function extractFrontendItemProps(backendItem: ItemResponse) {
  const { equipmentCosts, estimatedProfit, id, overheads, rowName, salary } =
    backendItem as any as Item | ItemResponse;
  return { equipmentCosts, estimatedProfit, id, overheads, rowName, salary };
}

export function findItemInTreeById(
  nodes: ItemNode[],
  id: Item['parentId']
): { foundNode: ItemNode; parentArray: ItemNode[]; index: number } | null {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id)
      return { foundNode: node, parentArray: nodes, index: i };
    if (node.children.length) {
      const childrenResult = findItemInTreeById(node.children, id);
      if (childrenResult) return childrenResult;
    }
  }

  return null;
}

export function applyChangesFromResponse(nodes: ItemNode[], changed: ItemResponse[]) {
  const changedItemMap: { [id: ItemResponse['id']]: ItemResponse } = {};
  changed.forEach((item) => (changedItemMap[item.id] = item));
  const changedIds = Object.keys(changedItemMap).map((id) => +id);

  applyChanges(nodes, changedItemMap, changedIds);

  function applyChanges(
    nodes: ItemNode[],
    changedItemMap: { [id: ItemResponse['id']]: ItemResponse },
    changedIds: ItemResponse['id'][]
  ) {
    nodes.forEach((node, index) => {
      if (changedIds.includes(node.id))
        nodes[index] = { ...node, ...changedItemMap[node.id] };
      if (node.children.length)
        applyChanges(node.children, changedItemMap, changedIds);
    });
  }
}