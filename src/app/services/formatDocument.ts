import dayjs from 'dayjs'

export const formatDocument = (
  doc: Record<string, any>,
  ignoredFields: Array<string> = [],
  dateFormatting = true
) => {
  console.log(doc)

  const formattedDoc: Record<string, any> = {}

  for (const key of Object.keys(doc)) {
    if (ignoredFields.includes(key)) {
      continue
    }

    if (dateFormatting && key.endsWith('_date')) {
      if (doc[key] instanceof Date) {
        formattedDoc[key] = (doc[key] as Date).valueOf()
      } else if (typeof doc[key] === 'string') {
        formattedDoc[key] = dayjs(doc[key]).valueOf()
      } else if (typeof doc[key] === 'number') {
        formattedDoc[key] = doc[key]
      }
    } else {
      formattedDoc[key] = doc[key]
    }
  }

  return formattedDoc
}
