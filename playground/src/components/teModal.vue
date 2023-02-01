<template>
    <transition  name="slide-fade">
    <div  class="modal fixed top-0 left-0 w-full pointer-events-none h-full outline-none overflow-x-hidden overflow-y-auto overlaybackground" tabindex="-1" aria-hidden="true">
        <div  class="modal-dialog relative w-auto " :class="{'modal-dialog-scrollable': scrollable, 'modal-dialog-centered': centered, ...sizeClass}">
          <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-xl outline-none text-current">
            <div v-if="!hideHeader" class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <slot name="header">
                <h5 class="text-xl font-medium leading-normal text-gray-800">{{title}}</h5>
              </slot>
              <button
                v-if="showCloseButton"
                type="button"
                class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline" 
                aria-label="Close"
                @click="close()"
              />
            </div>
            <div class="modal-body relative p-4">
              <component
                v-if="component"
                :is="component"
                v-bind="props"
                v-on="events"
              />
              <slot v-else name="default" />
            </div>
            <div v-if="!hideFooter"  class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-lg">
              <slot name="footer" />
            </div>
          </div>
        </div>
    </div>
  </transition>

  </template>
  
  <script>
  export default {
    name: 'teModal',
    props: {
      title: {
        type: String,
        required: false
      },
      visible: {
        type: Boolean,
        default: false,
      },
      showCloseButton: {
        type: Boolean,
        default: true
      },
      hideHeader: {
        type: Boolean,
        default: false,
      },
      hideFooter: {
        type: Boolean,
        default: false,
      },
      scrollable: {
        type: Boolean,
        default: false,
      },
      centered: {
        type: Boolean,
        default: false,
      },
      size: {
        type: String,
        default: '',
        validator: (value) => ['', 'xl', 'lg', 'sm'].includes(value)
      },
      component: [Object, Function, String],
      events: [Object],
      props: [Object],
    },
    computed: {
      sizeClass() {
        if (this.size.length) {
          return {
            [`modal-${this.size}`]: true
          }
        }
        return {};
      }
    },
    methods: {
      close() {
        console.debug("Closing the modal")
        this.$emit('close')
        this.$emit('update:visible', false);
      },
    }
  }
  </script>
  
  <style scoped>
    .overlaybackground {
      background-color: rgba(0, 0, 0, 0.5) !important;
    }
  
    .slide-fade-enter-active {
      transition: all 0.4s ease-out;
    }

    .slide-fade-leave-active {
      transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from{
      transform: translateY(-20px);
      opacity: 0;
    }
    .slide-fade-leave-to {
      transform: translateY(-20px);
      opacity: 0;
    }
  </style>