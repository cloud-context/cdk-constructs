import {
  expect as expectCDK,
  countResources,
  haveResourceLike,
  countResourcesLike
} from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { EncryptedWithDlqQueue } from '../lib/index'
import { Duration } from '@aws-cdk/core'

describe('encrypted queue', () => {
  it('should have 2 queues in the stack with default KMS encryption', () => {
    const app = new cdk.App()
    const stack = new cdk.Stack(app, 'TestStack')

    // WHEN
    new EncryptedWithDlqQueue(stack, 'MyTestConstruct')

    // THEN
    expectCDK(stack).to(countResources('AWS::SQS::Queue', 2))
    expectCDK(stack).to(
      countResourcesLike('AWS::SQS::Queue', 2, {
        KmsMasterKeyId: 'alias/aws/sqs'
      })
    )
  })

  it('should have max receives set to 5', () => {
    const app = new cdk.App()
    const stack = new cdk.Stack(app, 'TestStack')

    // WHEN
    new EncryptedWithDlqQueue(stack, 'MyTestConstruct', { maxReceiveCount: 5 })

    // THEN
    expectCDK(stack).to(
      haveResourceLike('AWS::SQS::Queue', {
        RedrivePolicy: {
          maxReceiveCount: 5
        }
      })
    )
  })

  it('should have a DLQ with the same props as the queue', () => {
    const app = new cdk.App()
    const stack = new cdk.Stack(app, 'TestStack')

    // WHEN
    new EncryptedWithDlqQueue(stack, 'MyTestConstruct', {
      queueProps: { retentionPeriod: Duration.seconds(100) }
    })

    // THEN
    expectCDK(stack).to(
      countResourcesLike('AWS::SQS::Queue', 2, {
        MessageRetentionPeriod: 100
      })
    )
  })
})
