// Hook executado antes da persistência de qualquer novo registro na coleção users
// Garante que nenhuma conta nasça desativada por omissão (is_active sempre true na criação)

onRecordCreate((e) => {
  const record = e.record
  if (record) {
    record.set('is_active', true)
  }
  e.next()
}, 'users')
