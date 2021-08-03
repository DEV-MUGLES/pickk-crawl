var axios = require('axios');

const SLACK_WEBHOOK =
  'https://hooks.slack.com/services/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';

/**
 * This is jest custom reporter to send test results to slack.
 * https://jestjs.io/docs/configuration#reporters-arraymodulename--modulename-options
 * */
class JestSlackReporter {
  onRunComplete(_, results) {
    let slackMessage = '[TEST RESULT]\n';
    slackMessage += `*총 ${results.numTotalTests} 개 중 ${results.numFailedTests} 개 실패* \n\n`;

    const testResults = results.testResults[0].testResults;
    const failedTests = [];
    // filter out failed tests
    for (let i = 0; i < testResults.length; i++) {
      if (testResults[i].status === 'failed') {
        failedTests.push(testResults[i].title);
      }
    }

    // add success message when all tests passed
    if (failedTests.length === 0) {
      slackMessage += '테스트 모두 성공! :clap:';
    } else {
      // add failed tests to slack message
      const visibleCount = 4;
      for (let i = 0; i < failedTests.length; i++) {
        if (i >= visibleCount) {
          break;
        }
        slackMessage += `${i + 1}. ${failedTests[i]} \n`;
      }
      if (failedTests.length > visibleCount) {
        slackMessage += `... 외 ${
          failedTests.length - visibleCount
        }개 <https://github.com/DEV-MUGLES/pickk-crawl/actions/workflows/slack-notify.yml|상세보기>`;
      }
    }

    this.sendMessage(slackMessage);
  }

  sendMessage(message) {
    axios.post(SLACK_WEBHOOK, {
      text: message,
    });
  }
}

module.exports = JestSlackReporter;
