import { Construct, CfnOutput } from '@aws-cdk/core'
import { Queue, QueueProps, QueueEncryption } from '@aws-cdk/aws-sqs'

export interface EncryptedWithDlqQueueProps extends QueueProps {
  queueProps?: QueueProps
  deadletterQueueProps?: QueueProps
  maxReceiveCount?: number | undefined
}

export class EncryptedWithDlqQueue extends Construct {
  public readonly queue: Queue
  public readonly errorQueue: Queue

  constructor(
    scope: Construct,
    id: string,
    props: EncryptedWithDlqQueueProps = {}
  ) {
    super(scope, id)

    this.errorQueue = new Queue(this, `${id}-error`, {
      ...(props.deadletterQueueProps ?? props.queueProps),
      encryption: QueueEncryption.KMS_MANAGED
    })

    this.queue = new Queue(this, `${id}-queue`, {
      ...props.queueProps,
      encryption: QueueEncryption.KMS_MANAGED,
      deadLetterQueue: {
        maxReceiveCount: props.maxReceiveCount ?? 3,
        queue: this.errorQueue
      }
    })

    new CfnOutput(this, `queue-url-output`, {
      value: this.queue.queueUrl,
      exportName: `${id}-queue-url`
    })
    new CfnOutput(this, `error-queue-url-output`, {
      value: this.errorQueue.queueUrl,
      exportName: `${id}-error-queue-url`
    })
  }
}
