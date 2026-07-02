import { BACKEND_BASE_URL } from "@/constants";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

if (!BACKEND_BASE_URL) {
  throw new Error("Missing BACKEND_BASE_URL environment variable");
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters, }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit: pageSize };

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : undefined;
        const value = String(filter.value);

        if (resource === 'subjects') {
          if (field === 'department') params.department = value;
          if (field === 'name') params.search = value;
        }
      })

      return params;
    },


    mapResponse: async (response) => {
      const json = await response.clone().json();
      // Your API returns: { data: [...], total: 123 }
      // Refine needs: [...]
      return json.data ?? [];
    },

    getTotalCount: async (response) => {
      const json = await response.clone().json();
      // Your API returns: { data: [...], total: 123 }
      // Refine needs: 123
      return json.pagination?.total ?? json.data?.length ?? 0;
    },
  }
}

export const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);