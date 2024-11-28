import http from './http'

function getCategories() {
  return http.get('/category')
}

export default { getCategories }
