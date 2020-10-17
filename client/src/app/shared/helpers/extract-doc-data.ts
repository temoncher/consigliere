import { DocumentChangeAction } from '@angular/fire/firestore';

export interface ExtractDocData {
  <T>(source: DocumentChangeAction<T>): (T & { id: string });
  <T>(source: DocumentChangeAction<T>[]): (T & { id: string })[];
}

export const extractDocData: ExtractDocData = <T>(
  docsChangeActions: DocumentChangeAction<T> | DocumentChangeAction<T>[],
): T & { id: string } | (T & { id: string })[] => {
  if (!(docsChangeActions instanceof Array)) {
    const { doc } = docsChangeActions.payload;

    const docWithId: T & { id: string } = {
      ...doc.data(),
      id: doc.id,
    };

    return docWithId;
  }

  const docs = docsChangeActions.map((docChangeAction) => {
    const { doc } = docChangeAction.payload;

    const docWithId: T & { id: string } = {
      ...doc.data(),
      id: doc.id,
    };

    return docWithId;
  });

  return docs;
};
