import { useParams } from '@solidjs/router';
import { Component, onMount } from 'solid-js';
import SearchPanel from '$components/search-panel';

const Detail: Component = () => {
  const params = useParams<{id: string}>();

  onMount(() => {
    console.log(params.id);
  });

  return (
    <div>
      <SearchPanel />
    </div>
  );
};

export default Detail;
