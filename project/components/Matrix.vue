<template>
  <div>
    <div v-if="showMatrix">
      <div class="leftPart">
        <div v-for="item of structure" :key="item.id">
          <div v-for="slotName in dynamicSlots" :key="slotName">
            <slot v-if="item.slotName === slotName" :name="slotName" :data="item"></slot>
          </div>
        </div>
      </div>
      <div class="rightPart">
        <div class="linear">
          <span v-for="date in linear" :key="date">{{ date }}</span>
        </div>
        <div class="matrix">
          <div v-for="item of structure" :key="item.id + 'row'">
            <template v-if="!item.noData">
              <slot name="rowValues" :data="valuesByLinear[item.id]"></slot>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

import { matrixConf as config } from '../config/matrixConfig';

export default {
  props: ['structure', 'linear', 'values'],
  data() {
    return {
      dynamicSlots: [],
    }
  },
  computed: {
    showMatrix() { return !_.isEmpty(this.structure); },
    valuesByLinear() { 
      const values = {};

      this.structure.forEach((str) => {
        values[str.id] = [];

        this.linear.forEach((date) => {
          values[str.id].push(_.get(this.values, [str.id, date], '-'));
        });
      });

      return values;
    }
  },
  watch: {
    structure() {
      this.checkValues();
    }
  },
  created() {
    this.dynamicSlots = config.slots || [];
  },
  methods: {
    checkValues() {
      const emptyValues = {};
      this.structure
        .filter(str => !str.noData)
        .forEach(str => {
          this.linear.forEach(date => {
            const founded = _.get(this.values, [str.id, date], false);

            if (!founded) {
              const dates = _.get(emptyValues, [str.id], []);
              _.set(emptyValues, [str.id], [...dates, date]);
            }
          })
        });

      if (!_.isEmpty(emptyValues)) {
        this.$emit('needData', emptyValues);
      }
    }
  }
}
</script>

