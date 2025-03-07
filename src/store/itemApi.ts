import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CreationItem,
  CreationItemRequest,
  DeleteItemResponse,
  Item,
  BackendItemNode,
  UpdateItemRequest,
  ItemNode,
  ItemResponse,
  CreationItemResponse,
  UpdateItemResponse,
} from 'src/types/item';

const API_BASE_URL = 'http://185.244.172.108:8081';
const API_ID = '148574';

export const itemApi = createApi({
  reducerPath: 'item',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL + `/v1/outlay-rows/entity/${API_ID}/row`,
  }),
  endpoints: (builder) => ({
    getItems: builder.query<ItemNode[], void>({
      query() {
        return {
          url: 'list',
        };
      },
      transformResponse(backendItems: BackendItemNode[]) {
        console.log('backendItem: ', backendItems);
        const res = backendToFrontendItemTree(backendItems);
        console.log('res: ', res);
        return res;
      },
    }),

    createItem: builder.mutation<CreationItemResponse, CreationItem>({
      query(item) {
        const backendItem: CreationItemRequest = {
          ...item,
          ...getBackendExtraProps(),
        };
        return {
          url: 'create',
          method: 'POST',
          body: backendItem,
        };
      },
      async onQueryStarted({ parentId }, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          const backendItem = response.data.current;
          const newItem: ItemNode = {
            ...extractFrontendItemProps(backendItem),
            parentId,
            children: [],
          };

          dispatch(
            itemApi.util.updateQueryData('getItems', undefined, (draft) => {
              if (parentId === null) draft.push(newItem);
              else {
                const parentItem = findInItemTreeById(
                  draft,
                  parentId
                )?.foundNode;
                if (parentItem) parentItem.children.push(newItem);
                else throw 'Creation: parentItem was not found';
              }
            })
          );
        } catch (error) {
          console.log('error: ', error);
        }
      },
    }),

    updateItem: builder.mutation<UpdateItemResponse, Item>({
      query(item) {
        const backendUpdateItem: UpdateItemRequest = {
          ...item,
          ...getBackendExtraProps(),
        };

        return {
          url: item.id + '/update',
          method: 'POST',
          body: backendUpdateItem,
        };
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          console.log('response: ', response);
          const backendItem = response.data.current;
          const updateItemPatch: Partial<ItemNode> = extractFrontendItemProps(backendItem);

          dispatch(
            itemApi.util.updateQueryData('getItems', undefined, (draft) => {
              const searchResult = findInItemTreeById(draft, id);

              if (searchResult) {
                const { foundNode, parentArray, index } = searchResult;
                parentArray[index] = { ...foundNode, ...updateItemPatch };
              } else throw 'Updating: item was not found';
            })
          );
        } catch (error) {
          console.log('error: ', error);
        }
      },
    }),

    deleteItem: builder.mutation<DeleteItemResponse, Item['id']>({
      query(id) {
        return {
          url: id + '/delete',
          method: 'DELETE',
        };
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          console.log('response: ', response);

          dispatch(
            itemApi.util.updateQueryData('getItems', undefined, (draft) => {
              const searchResult = findInItemTreeById(draft, id)

              if (searchResult) {
                const { parentArray, index } = searchResult
                parentArray.splice(index, 1)
              }
              else throw 'Deletion: item was not found';
            })
          );
        } catch (error) {
          console.log('error: ', error);
        }
      },
    }),
  }),
});

export const { useGetItemsQuery, useCreateItemMutation } = itemApi;

function getBackendExtraProps() {
  return {
    machineOperatorSalary: 0,
    mainCosts: 0,
    materials: 0,
    mimExploitation: 0,
    supportCosts: 0,
  };
}

function backendToFrontendItemTree(
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

function extractFrontendItemProps(backendItem: ItemResponse) {
  const { equipmentCosts, estimatedProfit, id, overheads, rowName, salary } =
    backendItem as any as Item | ItemResponse;
  return { equipmentCosts, estimatedProfit, id, overheads, rowName, salary };
}

function findInItemTreeById(
  nodes: ItemNode[],
  id: Item['parentId']
): { foundNode: ItemNode; parentArray: ItemNode[]; index: number } | null {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id)
      return { foundNode: node, parentArray: nodes, index: i };
    if (node.children.length) {
      const childrenResult = findInItemTreeById(node.children, id);
      if (childrenResult) return childrenResult;
    }
  }

  return null;
}
