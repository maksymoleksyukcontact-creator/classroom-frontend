import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { SUBJECTS_DATA } from "@/constants";
import { API_URL } from "./constants";

export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
  apiURL: API_URL,
});

// 2. Зберігаємо оригінальний метод getList, щоб не зламати інші сторінки
const originalGetList = dataProvider.getList;

// 3. Переписуємо ТІЛЬКИ метод getList на ходу
dataProvider.getList = async (params) => {

  const { resource } = params;

  // Твоя умова, як у автора: якщо запитують саме цей ресурс — повертаємо моки
  if (resource === 'subjects') {
    return {
      data: SUBJECTS_DATA as any,
      total: SUBJECTS_DATA.length,
    };
  }

  // Якщо ресурс інший (наприклад, 'users', 'posts') — викликаємо стару фабричну логіку
  return originalGetList(params);
};