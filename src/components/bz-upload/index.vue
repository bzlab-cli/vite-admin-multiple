<!--
 * @Author: jrucker
 * @Description:
 * @Date: 2021/11/26 09:54:36
 * @LastEditors: jrucker
 * @LastEditTime: 2024/08/27 14:31:07
-->

<script lang="ts">
import { defineComponent, h } from 'vue'
import BzUpload from '@bz/bz-upload'
import '@bz/bz-upload/lib/bz-upload.css'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { getEnv, Settings, getUploadEnv } from '@/config/settings'
const env = getEnv(import.meta.env.VITE_APP_ENV)
const uploadEnv = getUploadEnv(import.meta.env.VITE_APP_ENV)
const BzUploadComponent = window['bz-upload'] ? window['bz-upload'].default : BzUpload

function NOOP() {}
export default defineComponent({
  name: 'BzUpload',
  components: {
    BzUpload: BzUploadComponent
  },
  props: {
    isBim: {
      type: Boolean,
      default: false
    },
    aliyun: {
      type: Boolean,
      default: uploadEnv === 'aliyun'
    },
    keepOrigin: {
      type: Boolean,
      default: true
    },
    ossPrefix: {
      type: String,
      default: ''
    },
    ftpPrefix: {
      type: String,
      default: ''
    },
    ossDataEnum: {
      type: Object,
      default: () => ({
        md5: 'fileOssKey',
        size: 'fileSize'
      })
    },
    downloadDataEnum: {
      type: Object,
      default: () => ({
        name: 'fileName',
        key: 'ossKey'
      })
    },
    directory: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
    },
    download: {
      type: String,
      default: ''
    },
    headers: {
      type: Object,
      default: () => ({
        token: getToken()
      })
    },
    data: {
      type: Object,
      default: () => ({})
    },
    multiple: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'file'
    },
    drag: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'select'
    },
    beforeUpload: {
      type: Function,
      default: NOOP
    },
    beforeRemove: {
      type: Function,
      default: NOOP
    },
    onRemove: {
      type: Function,
      default: NOOP
    },
    onSuccess: {
      type: Function,
      default: NOOP
    },
    onProgress: {
      type: Function,
      default: NOOP
    },
    onError: {
      type: Function,
      default: null
    },
    onExceed: {
      type: Function,
      default: () => NOOP
    },
    onStart: {
      type: Function,
      default: () => NOOP
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    limit: {
      type: Number,
      default: null
    },
    showTotal: {
      type: Boolean,
      default: true
    },
    showMd5: {
      type: Boolean,
      default: true
    },
    fileWords: {
      type: Number,
      default: 200
    },
    directoryWords: {
      type: Number,
      default: 200
    }
  },
  render() {
    const userStore = bz.store
    const onError = res => {
      if (res.status === 500) {
        ElMessage.error('登录已失效，请重新登录')
        userStore.user.resetToken().then(() => {
          location.reload()
        })
      }
      if (res.status === 502) {
        ElMessage.error('服务器响应失败，请重试')
      }
    }
    const onSuccess = (res, file, files, trees) => {
      if (this.aliyun) {
        res.url = res.url.replace(/.*aliyuncs.com/, '')
      }
      this.onSuccess(res, file, files, trees)
    }
    const uploadData = {
      aliyun: this.aliyun,
      keepOrigin: this.keepOrigin,
      ossPrefix: this.ossPrefix,
      ftpPrefix: this.ftpPrefix,
      ossDataEnum: this.ossDataEnum,
      downloadDataEnum: this.downloadDataEnum,
      type: this.type,
      directory: this.directory,
      drag: this.drag,
      action: this.action,
      download: this.download,
      multiple: this.multiple,
      'before-upload': this.beforeUpload,
      showFileList: this.showFileList,
      headers: this.headers,
      name: this.name,
      data: this.data,
      accept: this.accept,
      fileList: this.fileList,
      autoUpload: this.autoUpload,
      disabled: this.disabled,
      fileWords: this.fileWords,
      directoryWords: this.directoryWords,
      limit: this.limit,
      showTotal: this.showTotal,
      showMd5: this.showMd5,
      'on-exceed': this.onExceed,
      'on-start': this.onStart,
      'on-progress': this.onProgress,
      'on-success': onSuccess,
      'on-error': this.onError ? this.onError : onError,
      'on-remove': this.onRemove,
      ref: 'bzUploadRef'
    }

    if (!uploadData.aliyun) {
      uploadData.action = import.meta.env.VITE_APP_FTP_API + `/ftp/uploadFile`
      uploadData.download = import.meta.env.VITE_APP_FTP_STATIC_API + ``
      if (this.isBim) {
        uploadData.ftpPrefix = `${env}/bim_temp`
      } else {
        uploadData.ftpPrefix = `${env}/file`
      }
    } else {
      uploadData.action = import.meta.env.VITE_APP_BASE_API + `/oss/getFileUploadInfo`
      uploadData.download = import.meta.env.VITE_APP_BASE_API + `/oss/getFileUrl`
      uploadData.ossPrefix = `${Settings.packageName}/${env}`
    }

    const trigger = this.$slots.trigger || this.$slots.default
    const uploadComponent = h(BzUploadComponent, uploadData, {
      default: () => trigger?.()
    })
    return h('div', [
      this.$slots.trigger ? [uploadComponent, (this.$slots as any).default()] : uploadComponent,
      this.$slots.tip?.()
    ])
  }
})
</script>
