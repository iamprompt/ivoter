import { Timestamp } from 'firebase-admin/firestore'

export const formatDocument = (
  doc: Record<string, any>,
  ignoredFields: Array<string> = [],
  dateFormatting = true
) => {
  const formattedDoc: Record<string, any> = {}

  for (const key of Object.keys(doc)) {
    if (ignoredFields.includes(key)) {
      continue
    }

    if (dateFormatting && key.endsWith('_date')) {
      if (doc[key] instanceof Date) {
        formattedDoc[key] = (doc[key] as Date).valueOf()
      } else if (doc[key] instanceof Timestamp) {
        formattedDoc[key] = (doc[key] as Timestamp).toDate().valueOf()
      } else if (typeof doc[key] === 'number') {
        formattedDoc[key] = doc[key]
      }
    } else {
      formattedDoc[key] = doc[key]
    }
  }

  return formattedDoc
}
