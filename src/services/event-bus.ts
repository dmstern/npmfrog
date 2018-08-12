import Vue from 'vue';
export const EventBus = new Vue();

export enum Events {
  FILTER_SEARCH = 'filter-search',
  QUERY_SEARCH = 'query-search',
}
