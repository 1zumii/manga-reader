import { useParams } from '@solidjs/router';
import { Component, onMount } from 'solid-js';

const Reader: Component = () => {
  const params = useParams<{id: string; chapterNum: string}>();

  onMount(() => {
    console.log(params.id);
  });

  return <></>;
};

export default Reader;
