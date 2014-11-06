/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package de.rinderle.softviz3d.sonar;

import com.google.inject.Singleton;
import de.rinderle.softviz3d.dto.MinMaxValueDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.math.BigDecimal;
import java.util.List;

/**
 * Use singleton to set the database session once on startup
 * and to be sure that it is set on any other injection.
 */
@Singleton
public class SonarDaoImpl implements SonarDao {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(SonarDaoImpl.class);

  private DatabaseSession session;

  @Override
  public void setDatabaseSession(final DatabaseSession session) {
    this.session = session;
  }

  @SuppressWarnings("unchecked")
  @Override
  public List<Integer> getDistinctMetricsBySnapshotId(final Integer snapshotId) {
    List<Integer> metricIds;

    try {
      this.session.start();

      final Query metricsQuery = this.session
        .createQuery("SELECT distinct metricId "
          + "FROM MeasureModel m WHERE m.snapshotId = :snapshotId "
          + "AND m.value is not null");
      metricsQuery.setParameter("snapshotId", snapshotId);

      metricIds = metricsQuery.getResultList();
    } catch (final PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      metricIds = null;
    } finally {
      this.session.stop();
    }

    return metricIds;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * de.rinderle.softviz3d.sonar.SonarDaoInterface#getMetricIdByName(java.
   * lang.String)
   */
  @Override
  public Integer getMetricIdByName(final String name) {
    Integer metricId;

    try {
      this.session.start();
      final Query query = this.session
        .createNativeQuery("SELECT id FROM metrics m WHERE m.name = :name");
      query.setParameter("name", name);

      metricId = (Integer) query.getSingleResult();
    } catch (final PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      metricId = null;
    } finally {
      this.session.stop();
    }

    return metricId;
  }

  @Override
  public MinMaxValueDTO getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId, int metricId) {
    MinMaxValueDTO result = null;
    try {
      this.session.start();
      final Query query = this.session
        .createNativeQuery("select MIN(m.value) as min, MAX(m.value) as max "
          + "from snapshots s "
          + "INNER JOIN project_measures m ON s.id = m.snapshot_id "
          + "WHERE s.path LIKE :rootSnapshotId AND m.metric_id = :metric_id "
          + "AND s.scope != 'PRJ' AND s.scope != 'DIR'");

      query.setParameter("rootSnapshotId", rootSnapshotId + ".%");
      query.setParameter("metric_id", metricId);

      final Object[] sqlResult = (Object[]) query.getSingleResult();
      final double min = ((BigDecimal) sqlResult[0]).doubleValue();
      final double max = ((BigDecimal) sqlResult[1]).doubleValue();

      result = new MinMaxValueDTO(min, max);
    } catch (final PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
    } finally {
      this.session.stop();
    }

    return result;
  }

  /**
   * TODO: Should be done within one method for both metrics
   * using @SqlResultSetMapping. Gave it a try but didn't work as
   * expected.
   *
   */
  @Override
  public List<Object[]> getAllProjectElementsWithMetric(final Integer rootSnapshotId, final Integer metricId) {
    List<Object[]> result;

    try {
      this.session.start();

      final String sqlQuery = "SELECT s.id, p.path, metric.value " +
        "FROM snapshots s " +
        "INNER JOIN projects p ON s.project_id = p.id " +
        "LEFT JOIN project_measures metric ON s.id = metric.snapshot_id " +
        "AND metric.metric_id = :metricId " +
        "WHERE s.root_snapshot_id = :id " +
        "ORDER BY p.path";

      final Query query = this.session
        .createNativeQuery(sqlQuery);

      query.setParameter("id", rootSnapshotId);
      query.setParameter("metricId", metricId);

      result = query.getResultList();
    } catch (final PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      result = null;
    } finally {
      this.session.stop();
    }

    return result;
  }

}
