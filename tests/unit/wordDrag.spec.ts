import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import WordDrag from '@/pages/wordDrag/App.vue'

describe('WordDrag -- App.vue', () => {
  it('页面加载后 初始化字母区域', () => {
    const wrapper = mount(WordDrag)
    const vm = wrapper.vm
    console.log('vm', vm)
    // expect(vm.initAreaMap()).to.include(msg)
  })
})