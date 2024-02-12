'use client';

import { usePolicyByIdOrSlug } from '@/hooks/policy/policy';
import React, { useEffect, useState } from 'react';
import editorJsHtml from 'editorjs-html';
import _ from 'lodash';

const Terms = ({ params }: { params: { slug: string; lang: string } }) => {
  const { data, isFetched, isLoading, isError } = usePolicyByIdOrSlug(
    params.slug,
  );

  const [renderHtml, setRenderHtml] = useState<string[]>([]);

  useEffect(() => {
    if (data?.data.data) {
      const policy = data?.data.data;

      const editorJsParser = editorJsHtml();

      let translation = policy.policyTranslations?.find(
        translationElement => translationElement.localeId === params.lang,
      );

      if (!translation) {
        translation = policy.policyTranslations?.find(
          translationElement => translationElement.localeId === 'en',
        );

        if (!translation) {
          return;
        }
      }

      if (translation.content === null || _.isEmpty(translation.content)) {
        return;
      }

      const html = editorJsParser.parse(JSON.parse(translation.content!));

      setRenderHtml(html);
    }
  }, [data]);

  return (
    <div>
      {isLoading && !isError && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}
      {isFetched && renderHtml.length > 0 && (
        <div
          className="policy-render"
          dangerouslySetInnerHTML={{ __html: renderHtml.join('') }}
        ></div>
      )}
    </div>
  );
};

export default Terms;
