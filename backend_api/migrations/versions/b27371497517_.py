"""empty message

Revision ID: b27371497517
Revises: 
Create Date: 2022-12-02 11:39:29.887675

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b27371497517'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chatgroups',
    sa.Column('group_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('group_name', sa.String(length=155), nullable=False),
    sa.Column('group_description', sa.Text(), nullable=False),
    sa.Column('group_founder', sa.Integer(), nullable=True),
    sa.Column('group_creation_date', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['group_founder'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('group_id')
    )
    op.create_table('group__inbox',
    sa.Column('grp_msg_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('grp_msg_sender', sa.Integer(), nullable=True),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('datesent', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['grp_msg_sender'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('grp_msg_id')
    )
    op.create_table('group__members',
    sa.Column('group_member_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('chat_group_id', sa.Integer(), nullable=True),
    sa.Column('member', sa.Integer(), nullable=True),
    sa.Column('date_added', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['chat_group_id'], ['chatgroups.group_id'], ),
    sa.ForeignKeyConstraint(['member'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('group_member_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('group__members')
    op.drop_table('group__inbox')
    op.drop_table('chatgroups')
    # ### end Alembic commands ###
