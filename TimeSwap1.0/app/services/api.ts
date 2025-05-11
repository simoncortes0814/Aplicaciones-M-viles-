interface RandomUserResponse {
  results: Array<{
    name: {
      first: string;
      last: string;
    };
    picture: {
      large: string;
      medium: string;
      thumbnail: string;
    };
    dob: {
      age: number;
    };
  }>;
}

export const fetchRandomUsers = async (count: number = 1): Promise<RandomUserResponse> => {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}&nat=es`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching random users:', error);
    throw error;
  }
};

// Ejemplo de uso:
// const users = await fetchRandomUsers(5);
// users.results.forEach(user => {
//   console.log(`Name: ${user.name.first} ${user.name.last}`);
//   console.log(`Picture: ${user.picture.large}`);
//   console.log(`Age: ${user.dob.age}`);
// });

// URLs de imágenes estáticas
export const getRandomUserImage = {
  woman: (id: number) => `https://randomuser.me/api/portraits/women/${id}.jpg?v=2`,
  man: (id: number) => `https://randomuser.me/api/portraits/men/${id}.jpg?v=2`,
  lego: (id: number) => `https://randomuser.me/api/portraits/lego/${id}.jpg?v=2`,
};

// Documentación de la API:
// https://randomuser.me/documentation
// Endpoints disponibles:
// - Obtener usuarios aleatorios: https://randomuser.me/api/
// - Filtrar por género: https://randomuser.me/api/?gender=female
// - Filtrar por nacionalidad: https://randomuser.me/api/?nat=es
// - Múltiples resultados: https://randomuser.me/api/?results=10
// - Semilla para resultados consistentes: https://randomuser.me/api/?seed=foobar
// 
// Límites de la API:
// - 1000 resultados por solicitud
// - Sin límite de solicitudes para uso básico
// - Se recomienda cachear resultados para uso intensivo 