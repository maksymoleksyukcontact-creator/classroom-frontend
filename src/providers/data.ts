import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { SUBJECTS_DATA } from "@/constants";
import { API_URL } from "./constants";
import { BaseRecord, GetListParams, GetListResponse } from "@refinedev/core";

export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
  apiURL: API_URL,
});

const originalGetList = dataProvider.getList;

dataProvider.getList = async <TData extends BaseRecord = BaseRecord>(params: GetListParams): Promise<GetListResponse<TData>> => {

  const { resource } = params;

  if (resource === 'subjects') {
    return {
      data: SUBJECTS_DATA as unknown as TData[],
      total: SUBJECTS_DATA.length,
    };
  }
  

  return originalGetList(params);
};