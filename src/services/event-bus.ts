import Vue from 'vue';
export const EventBus = new Vue();

export enum Events {
  FILTER_SEARCH = 'filter-search',
}

export enum Errors {
  SERVER_ERROR = 'server-error',
}
