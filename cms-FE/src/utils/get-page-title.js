import config from '@/config'

const projectName = config.projectName

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${projectName}`
  }
  return `${projectName}`
}
