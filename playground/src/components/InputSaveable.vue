 <template>
 <input ref="component" @input="currentValue=$event.target.value" v-bind="$props" class="border rounded-md border-borderColor" @change="handleChange"
 v-on:keyup.enter="handleEnter"
 />
</template>
<script lang="js">
export default {
  name: "inputSaveable",
  props:{
    value:{
      type: undefined
    }
  },
  created() {
    this.startingValue=this.$props.value
  },
  computed:{
    isDifferent(){
      return this.currentValue == this.startingValue
    }
  },
  data(){
    return {
      currentValue:"",
      startingValue:""
    }
  },
  updated(){
    if(this.currentValue===this.$props.value){
      this.$refs.component.classList.remove('unsavedContent')
    }
  },
  methods:{
    handleChange(){
      if(this.currentValue!=this.$props.value){
        console.info("SaveableInput onSave:",this.currentValue)
        this.$emit('save',this.currentValue)
      }
    },
    handleEnter(){
      this.handleChange()
      
    }
  },
  watch: {
    currentValue(newVal){
        if(newVal==this.$props.value){
          console.debug("SaveableInput: No change:",this.$refs.component)
          this.$refs.component.classList.remove('unsavedContent')
        }else{
          console.debug("SaveableInput changed: ",this.startingValue,this.currentValue,this.$refs.component)
          this.$refs.component.classList.add('unsavedContent')
        }
    },
  },
}
</script>
<style lang="postcss">

.unsavedContent {
  @apply border border-yellow-300 bg-yellow-50 focus-visible:border-yellow-500;
}

</style>