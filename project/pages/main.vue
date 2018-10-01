<template>
  <div class="container">
    <h1>Hello world</h1>
    <hr>
    Sructure
    <div v-for="str of storeStructure" :key="str.id">
      <label :for="`${str.name}-${str.id}`">{{ str.name }}</label>
      <input type="checkbox" :id="`${str.name}-${str.id}`" :value="str.id" v-model="checkedStructure">
    </div>
    
    <br>
    <br>
    <br>
    <br>
    
    <Matrix 
      :structure="matrixStructure" 
      :linear="linear" 
      :values="values"

      @needData="getValues"
    >
      <template slot="propertyLine" slot-scope="row">
        <div>
          <span>Property</span>
          <span @click="showHide(row.data)"> {{row.data.checked ? 'Hide' : 'Show'}}</span>
        </div>
      </template>
      
      <template slot="hotelLine" slot-scope="row">
        <div>
          <span>Hotels</span>
          <span @click="showHide(row.data)"> {{row.data.checked ? 'Hide' : 'Show'}}</span>
        </div>
      </template>

      <template slot="roomLine" slot-scope="row">
        <div>
          <span><b>{{ row.data.name }}</b></span>
        </div>
      </template>

      <template slot="rowValues" slot-scope="row">
        <span v-for="cell in row.data" :key="cell">{{ cell }}</span>
      </template>

    </Matrix>
  </div>
</template>

<script>
import _ from 'lodash';

import '../assets/main.css';

import Matrix from '../components/Matrix';
import { structure as storeStructure, linear, getValues } from '../store/matrixData';

export default {
  components: { Matrix },
  data() {
    return {
      storeStructure,
      storeValues: getValues(),
      linear,
      checkedStructure: [],
      values: {},
    };
  },
  computed: {
    matrixStructureByFilter() {
      return this.storeStructure
        .filter(entity => this.checkedStructure.includes(entity.id));
    },
    matrixStructure() {
      const skipIds = [];
      const structureByShowHide = [];

      this.matrixStructureByFilter.forEach((entity) => {
        if (entity.checked) {
          skipIds.push(entity.id);
        }

        if (skipIds.includes(entity.parentId)) {
          if (entity.noData) { skipIds.push(entity.id) }
        } else {
          structureByShowHide.push(entity);
        }
      });

      return structureByShowHide;
    }
  },
  methods: {
    getValues(payload) {
      const tmpValues = {};

      Object.keys(payload).forEach(roomId => {
        const dates = payload[roomId];
        dates.forEach(date => {
          const value = _.get(this.storeValues, [roomId, date], '-');
          _.set(tmpValues, [roomId, date], value);
        })
      });

      this.values = _.merge(this.values, tmpValues);
    },
    showHide(data) {
      data.checked = !data.checked;
    }
  }
}
</script>


