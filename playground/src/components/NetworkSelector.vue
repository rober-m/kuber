<script setup lang="ts">
import {  addNewNetwork,removeNetwork, resetNetwork, NetworkName, updateUrl, type Network } from "@/services/walletNetwork";
import { Buffer } from "buffer";
import { callKuber, getPolicyIdOfScriptFromKuber, listProviders, signTx, submitTx } from "kuber-client"
import { defaultNetworks, activeNetwork, networks, switchNetwork } from "@/services/walletNetwork"
import teModal from "./teModal.vue"
import InputSaveable from "./InputSaveable.vue"
import type { NetworkInfo } from "@emurgo/cardano-serialization-lib-asmjs";
enum ModalTab {
  EditNetwork,
  AddNetwork,
}
</script>
<template>
  <div class="dropdown 2xl:text-sm xl:text-xs lg:text-xs">
  
  <div>
    <button v-if="activeNetwork" :class="
      activeNetwork.border +
      '    border-2 font-sans font-semibold rounded-lg text-white  leading-tight uppercase hover:bg-gray-100  active:bg-gray-200 active:shadow-lg active:text-white ease-in-out flex items-center justify-center whitespace-nowrap'
    " type="button" id="dropdownMenuButton1" @click="() => dropdownVisible = !dropdownVisible" aria-expanded="false">
      <span v-if="activeNetwork" :class="activeNetwork['text'] + ' py-1 pl-2'">{{ activeNetwork.name }}
        <span class="pr-2">
          <v-icon name="md-keyboardarrowdown-round" />
        </span>
      </span>
      <span v-else
        class="py-1 px-4 rounded-full text-blue-500 font-semibold flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease">
      </span>
    </button>
    <div v-if="dropdownVisible"  @click="dropdownVisible=false" class=" z-10 modal fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto " tabindex="-1" aria-hidden="true">
    </div>
    <table v-show="dropdownVisible"
      class="flex z-20 flex-col w-full right-0 min-w-max absolute bg-white text-base float-left pt-2 text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-2 border-blue-400 border-opacity-30"
      aria-labelledby="dropdownMenuButton1">
      <tr @click="onNetworkSwitch(networkId)" v-for="(network, networkId) in networks" :key="network['name']"
        class="border-b-2 hover:bg-gray-100 cursor-pointer 2xl:text-sm xl:text-xs lg:text-xs">
        <td
          :class="network['text'] + ' mr-4 dropdown-item  py-2 px-4 font-normal hover:bg-transparent bg-transparent text-center text-gray-700'">
          {{ network["name"] }}
        </td>
        <td class="dropdown-item py-2 px-4 font-normal hover:bg-transparent bg-transparent text-gray-700">
          {{ network["display"] }}
        </td>
      </tr>

      <button type="button"
        class="flex items-center cursor-pointer py-3 justify-center 2xl:text-sm xl:text-xs lg:text-xs px-4 font-semibold hover:bg-menuBar rounded-b-lg hover:text-white bg-transparent text-gray-700"
        @click="showNetworkEditModal()" >
        Edit/Add Network
        <span>
          <v-icon class="ml-2" name="fa-edit" />
        </span>
      </button>
    </table>
    </div>
  
    <te-modal v-show="modal.visible"  hide-footer @close="modal.visible=!modal.visible">
      <template #header>
        <span class="mr-2 text-gray-400 font-semibold items-center justify-between">
          <v-icon name="ri-settings-5-line" />
          <span> Edit/Add Networks</span>
         </span>  
      </template>
      <template #default>
       <!-- Modal Tab options -->
        <div class="flex text-sm font-semibold text-gray-400 space-x-4 px-8">

          <div @click="changeNetworkTab(ModalTab.EditNetwork)" class="flex flex-col space-y-1 cursor-pointer test-gray-400">
            <div v-if="modal.activeTab === ModalTab.EditNetwork" class="text-gray-800">
              Edit Network
              <div class="h-[2px] bg-menuBar rounded-full"></div>
            </div>
            <div v-else>Edit Network</div>                  
          </div>

          <div @click="changeNetworkTab(ModalTab.AddNetwork)" class="flex flex-col space-y-1 cursor-pointer test-gray-400">
            <div v-if="modal.activeTab === ModalTab.AddNetwork" class="text-gray-800">
              Add Network
              <div class="h-[2px] bg-menuBar rounded-full"></div>
            </div>
            <div v-else>Add Network</div>                  
          </div>
        </div>
        <!-- Edit Network TAb -->
        <div v-if="modal.activeTab === ModalTab.EditNetwork"
          class="flex flex-col items-start mt-2 px-8 pb-4 overflow-y-auto">
          <div v-for="network, networkName in editableNetworks" :key="network['display']"
            class="flex w-full space-x-2 items-center justify-between pt-2">
            <div :class="
              activeNetwork.name === network['name']
                ? network['text'] +
                ' flex justify-start items-start w-1/3 mr-4  text-sm  font-semibold hover:bg-transparent  text-start '
                : ' flex justify-start items-start w-1/3 mr-4  text-sm  font-semibold hover:bg-transparent  text-start text-gray-400'
            ">
              <span>{{ network.name }}</span>
              <span class="text-gray-400">
              <v-icon v-if="network['name'] === 'Auto'" class="ml-2"
                  name="hi-solid-lock-closed" />
              </span>
            </div>
            <input-saveable
              class="flex w-2/3 text-sm py-2  px-4 font-normal text-gray-700"
              @save="val=>editNetwork(networkName,val)"
              type="text"  :value="network['url']"/>
            <span v-if="isUneditableNetwork(networkName)"><v-icon @click="resetUrl(networkName)"
                class="text-gray-400 hover:text-gray-600 cursor-pointer" name="md-lockreset-round" /></span>
            <span v-else><v-icon class="text-white cursor-default" name="md-lockreset-round" /></span>
          </div>
        </div>

        <!-- Add network Tab-->
        <div v-if="modal.activeTab === ModalTab.AddNetwork"
          class="flex flex-col items-start mt-2  px-8 pb-4 overflow-y-auto">
          <div class="flex flex-col w-full space-y-2 pt-2">
            <div
              :class="' flex justify-start items-start w-1/3 mr-4  text-sm  font-semibold hover:bg-transparent  text-start text-gray-800'">
              Network name
            </div>
            <input id="name"
              ref = "inputNetworkName"
              class="flex w-full text-sm py-2 rounded-lg border border-borderColor px-4 font-normal hover:bg-transparent bg-transparent text-gray-700 focus:border-blue-500"
              type="text" />
            <p v-show="modal.editError.name" class="flex items-center text-red-500 text-xs pt-2">
              <span><v-icon class="mr-1" name="md-erroroutline-outlined" scale="0.9" /></span>
              {{ modal.editError.name }}
            </p>
          </div>

          <div class="flex flex-col w-full space-y-2 mt-4">
            <div
              :class="' flex justify-start items-start w-1/3 mr-4  text-sm  font-semibold hover:bg-transparent  text-start text-gray-800'">
              URL
            </div>
            <input id="url"
            ref = "inputNetworkUrl"
              class="flex w-full text-sm py-2 rounded-lg border border-borderColor px-4 font-normal hover:bg-transparent bg-transparent text-gray-700 focus:border-blue-500"
              type="text" />
            <p v-show="modal.editError.url" class="flex items-center text-red-500 text-xs pt-2">
              <span><v-icon class="mr-1" name="md-erroroutline-outlined" scale="0.9" /></span>
              {{ modal.editError.url }}
            </p>
          </div>

          <div
            class="flex justify-center items-center bg-primary hover:bg-blue-600 py-1 mt-5 text-white font-semibold text-sm w-16 rounded-md shadow-sm cursor-pointer"
            @click="onAddNetwork()">
            Save
          </div>
        </div>
      </template>
    </te-modal> 
  </div>

</template>
<script lang="ts">

export default {
  components: {teModal,InputSaveable},
  data() {
    return {
      modal: {
        visible: false,
        activeTab: ModalTab.EditNetwork,
        currentEdit: undefined,
        editError: {
          name: undefined,
          url: undefined
        },
      },
      dropdownVisible: false,

    }
  },
  computed:{
    editableNetworks():Record<NetworkName,Network>{
        let ret:Record<string,Network>={}
        for(let name in networks){
          if(name!=NetworkName.Auto){
            ret[name]=networks[name]
          }
        }
        return ret;
    }
  },
  methods: {
    isUneditableNetwork(network: NetworkName) {
      return (network != NetworkName.Auto) && defaultNetworks[network]
    },
    showNetworkEditModal(){
      this.modal.visible=true
      this.dropdownVisible=false
    },
    changeNetworkTab(tab: ModalTab) {
      this.modal.activeTab = tab;
    },
    onAddNetwork() {
      // @ts-ignore
      let name=this.$refs.inputNetworkName.value , url = this.$refs.inputNetworkUrl.value 
      let err=addNewNetwork(name,url)
      if(err){
        console.error("OnAddNetwork",name,url,err)
        this.modal.editError=err
      }else{
        console.info("OnAddNetwork",name,url)
        this.modal.activeTab=ModalTab.EditNetwork
      }
        
    },
    resetUrl(name: NetworkName) {
      resetNetwork(name)
    },
    editNetwork(network: NetworkName, val:string) {
      updateUrl(network,val)
    },
    openNetworkDropdown() {

    },
    onNetworkSwitch(networkId: NetworkName) {
      switchNetwork(networkId)
      this.dropdownVisible = false
    }
  }
}
</script>
<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}
.inactive{
  display:none
}
</style>
