import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  backendToFrontendItemTree,
  getBackendItemExtraProps,
  extractFrontendItemProps,
  findItemInTreeById,
  applyChangesFromResponse,
} from 'src/helpers/itemHelpers';
import {
  CreationItem,
  CreationItemRequest,
  DeleteItemResponse,
  Item,
  BackendItemNode,
  UpdateItemRequest,
  ItemNode,
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
          ...getBackendItemExtraProps(),
        };
        return {
          url: 'create',
          method: 'POST',
          body: backendItem,
        };
      },
      async onQueryStarted({ parentId, level }, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          const { current, changed } = response.data;
          const newItem: ItemNode = {
            ...extractFrontendItemProps(current),
            parentId,
            level,
            children: [],
          };

          dispatch(
            itemApi.util.updateQueryData('getItems', undefined, (draft) => {
              // current
              if (parentId === null) draft.push(newItem);
              else {
                const parentItem = findItemInTreeById(
                  draft,
                  parentId
                )?.foundNode;
                if (parentItem) parentItem.children.push(newItem);
                else throw 'Creation: parentItem was not found';
              }

              // changed
              if (changed.length) applyChangesFromResponse(draft, changed);
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
          ...getBackendItemExtraProps(),
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
          const { current, changed } = response.data;
          const updateItemPatch: Partial<ItemNode> =
            extractFrontendItemProps(current);

          dispatch(
            itemApi.util.updateQueryData('getItems', undefined, (draft) => {
              // current
              const searchResult = findItemInTreeById(draft, id);

              if (searchResult) {
                const { foundNode, parentArray, index } = searchResult;
                parentArray[index] = { ...foundNode, ...updateItemPatch };
              } else throw 'Updating: item was not found';

              // changed
              if (changed.length) applyChangesFromResponse(draft, changed);
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
          const { changed } = response.data;

          dispatch(
            itemApi.util.updateQueryData('getItems', undefined, (draft) => {
              // current
              const searchResult = findItemInTreeById(draft, id);

              if (searchResult) {
                const { parentArray, index } = searchResult;
                parentArray.splice(index, 1);
              } else throw 'Deletion: item was not found';

              // changed
              if (changed.length) applyChangesFromResponse(draft, changed);
            })
          );
        } catch (error) {
          console.log('error: ', error);
        }
      },
    }),
  }),
});

export const {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemApi;
